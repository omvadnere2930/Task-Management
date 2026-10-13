import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { dbStatus } from '../config/db.js';
import { UserModel } from '../models/User.js';
import { TaskModel } from '../models/Task.js';

// In-Memory store fallback in case local MongoDB is not running
const memUsers = [];
const memTasks = [];

const generateId = () => new mongoose.Types.ObjectId().toString();

export const StorageService = {
  // ----------------- USER METHODS -----------------
  async createUser(userData) {
    if (dbStatus.isConnected) {
      const user = new UserModel(userData);
      await user.save();
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    }

    // In-Memory fallback
    const existing = memUsers.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('Email is already registered');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = {
      _id: generateId(),
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memUsers.push(newUser);
    const { password, ...safeUser } = newUser;
    return safeUser;
  },

  async findUserByEmail(email, includePassword = false) {
    if (dbStatus.isConnected) {
      const query = UserModel.findOne({ email: email.toLowerCase() });
      if (includePassword) {
        query.select('+password');
      }
      const user = await query.exec();
      return user;
    }

    // In-memory fallback
    const user = memUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    if (includePassword) return { ...user };
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async findUserById(id) {
    if (dbStatus.isConnected) {
      return UserModel.findById(id).select('-password');
    }
    const user = memUsers.find((u) => u._id.toString() === id.toString());
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async comparePassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  },

  // ----------------- TASK METHODS -----------------
  async findTasks(userId, filters = {}) {
    const { search, status, priority, overdue, sortBy = 'dueDate', order = 'asc' } = filters;
    const sortMultiplier = order === 'desc' ? -1 : 1;

    if (dbStatus.isConnected) {
      const query = { user: userId };

      if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) {
        query.status = status;
      }

      if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
        query.priority = priority;
      }

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ title: regex }, { description: regex }];
      }

      if (overdue === true || overdue === 'true') {
        query.dueDate = { $lt: new Date() };
        query.status = { $ne: 'Completed' };
      }

      const sortOptions = {};
      if (sortBy === 'dueDate') sortOptions.dueDate = sortMultiplier;
      else if (sortBy === 'createdAt') sortOptions.createdAt = sortMultiplier;
      else if (sortBy === 'title') sortOptions.title = sortMultiplier;
      else if (sortBy === 'priority') {
        sortOptions.priority = sortMultiplier;
      } else {
        sortOptions.dueDate = 1;
      }

      return TaskModel.find(query).sort(sortOptions).exec();
    }

    // In-memory fallback
    const now = new Date();
    let tasks = memTasks.filter((t) => t.user.toString() === userId.toString());

    if (status && status !== 'All') {
      tasks = tasks.filter((t) => t.status === status);
    }

    if (priority && priority !== 'All') {
      tasks = tasks.filter((t) => t.priority === priority);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      tasks = tasks.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }

    if (overdue === true || overdue === 'true') {
      tasks = tasks.filter((t) => new Date(t.dueDate) < now && t.status !== 'Completed');
    }

    // Sort
    const priorityWeights = { High: 3, Medium: 2, Low: 1 };
    tasks.sort((a, b) => {
      if (sortBy === 'priority') {
        const pA = priorityWeights[a.priority] || 0;
        const pB = priorityWeights[b.priority] || 0;
        return (pA - pB) * sortMultiplier;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title) * sortMultiplier;
      }
      if (sortBy === 'createdAt') {
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * sortMultiplier;
      }
      // default: dueDate
      return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * sortMultiplier;
    });

    return tasks;
  },

  async findTaskById(taskId, userId) {
    if (dbStatus.isConnected) {
      return TaskModel.findOne({ _id: taskId, user: userId }).exec();
    }
    return (
      memTasks.find((t) => t._id.toString() === taskId.toString() && t.user.toString() === userId.toString()) ||
      null
    );
  },

  async createTask(taskData) {
    if (dbStatus.isConnected) {
      const task = new TaskModel({
        ...taskData,
        dueDate: new Date(taskData.dueDate),
      });
      return task.save();
    }

    const newTask = {
      _id: generateId(),
      title: taskData.title.trim(),
      description: (taskData.description || '').trim(),
      status: taskData.status || 'Pending',
      priority: taskData.priority || 'Medium',
      dueDate: new Date(taskData.dueDate),
      user: taskData.user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memTasks.push(newTask);
    return newTask;
  },

  async updateTask(taskId, userId, updates) {
    if (dbStatus.isConnected) {
      const updateData = { ...updates };
      if (updates.dueDate) updateData.dueDate = new Date(updates.dueDate);
      return TaskModel.findOneAndUpdate(
        { _id: taskId, user: userId },
        { $set: updateData },
        { new: true, runValidators: true }
      ).exec();
    }

    const index = memTasks.findIndex(
      (t) => t._id.toString() === taskId.toString() && t.user.toString() === userId.toString()
    );
    if (index === -1) return null;

    const existing = memTasks[index];
    const updated = {
      ...existing,
      ...updates,
      dueDate: updates.dueDate ? new Date(updates.dueDate) : existing.dueDate,
      updatedAt: new Date(),
    };
    memTasks[index] = updated;
    return updated;
  },

  async deleteTask(taskId, userId) {
    if (dbStatus.isConnected) {
      const result = await TaskModel.findOneAndDelete({ _id: taskId, user: userId }).exec();
      return !!result;
    }

    const index = memTasks.findIndex(
      (t) => t._id.toString() === taskId.toString() && t.user.toString() === userId.toString()
    );
    if (index === -1) return false;
    memTasks.splice(index, 1);
    return true;
  },

  async getTaskStats(userId) {
    const allUserTasks = await this.findTasks(userId, {});
    const now = new Date();

    let total = allUserTasks.length;
    let pending = 0;
    let inProgress = 0;
    let completed = 0;
    let overdue = 0;
    let highPriority = 0;
    let mediumPriority = 0;
    let lowPriority = 0;

    for (const t of allUserTasks) {
      if (t.status === 'Completed') completed++;
      else if (t.status === 'In Progress') inProgress++;
      else pending++;

      if (t.status !== 'Completed' && new Date(t.dueDate) < now) {
        overdue++;
      }

      if (t.priority === 'High') highPriority++;
      else if (t.priority === 'Medium') mediumPriority++;
      else if (t.priority === 'Low') lowPriority++;
    }

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue,
      highPriority,
      mediumPriority,
      lowPriority,
      completionRate,
    };
  },

  async seedUserTasks(userId) {
    const now = new Date();
    const addDays = (days) => {
      const d = new Date(now);
      d.setDate(d.getDate() + days);
      return d;
    };

    const sampleTasks = [
      {
        title: 'Complete System Architecture Review',
        description: 'Verify MERN stack folder layout, Mongoose schemas, and JWT middleware security.',
        status: 'In Progress',
        priority: 'High',
        dueDate: addDays(1),
        user: userId,
      },
      {
        title: 'Configure MongoDB Atlas Cluster & Whitelist IPs',
        description: 'Set up cloud database connection URI, network security, and database user permissions.',
        status: 'Completed',
        priority: 'Medium',
        dueDate: addDays(-2),
        user: userId,
      },
      {
        title: 'Review Overdue Project Milestones',
        description: 'Audit tasks past their due date and realign team priorities for upcoming sprint.',
        status: 'Pending',
        priority: 'High',
        dueDate: addDays(-1),
        user: userId,
      },
      {
        title: 'Write REST API Documentation & Postman Collection',
        description: 'Export Postman collection JSON and verify all CRUD endpoint status codes.',
        status: 'Pending',
        priority: 'Medium',
        dueDate: addDays(4),
        user: userId,
      },
      {
        title: 'Prepare Windows PowerShell Setup Commands Guide',
        description: 'Document step-by-step setup commands and npm troubleshooting for team onboarding.',
        status: 'Completed',
        priority: 'Low',
        dueDate: addDays(6),
        user: userId,
      },
    ];

    const created = [];
    for (const st of sampleTasks) {
      const t = await this.createTask(st);
      created.push(t);
    }
    return created;
  },
};
