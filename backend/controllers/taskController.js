import { StorageService } from '../services/storageService.js';

// @desc    Get all tasks for the logged in user with search, filter, and sorting
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { search, status, priority, overdue, sortBy, order } = req.query;

    const tasks = await StorageService.findTasks(userId, {
      search: typeof search === 'string' ? search : undefined,
      status: typeof status === 'string' ? status : undefined,
      priority: typeof priority === 'string' ? priority : undefined,
      overdue: overdue === 'true',
      sortBy: typeof sortBy === 'string' ? sortBy : 'dueDate',
      order: order === 'desc' ? 'desc' : 'asc',
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user task statistics and dashboard metrics
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const stats = await StorageService.getTaskStats(userId);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const task = await StorageService.findTaskById(taskId, userId);
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to access it.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description, status, priority, dueDate } = req.body;

    const newTask = await StorageService.createTask({
      title,
      description,
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate,
      user: userId,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: newTask,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { title, description, status, priority, dueDate } = req.body;

    const existingTask = await StorageService.findTaskById(taskId, userId);
    if (!existingTask) {
      res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to modify it.',
      });
      return;
    }

    const updatedTask = await StorageService.updateTask(taskId, userId, {
      title,
      description,
      status,
      priority,
      dueDate,
    });

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const existingTask = await StorageService.findTaskById(taskId, userId);
    if (!existingTask) {
      res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to delete it.',
      });
      return;
    }

    await StorageService.deleteTask(taskId, userId);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Seed sample tasks for demonstration/testing
// @route   POST /api/tasks/seed
// @access  Private
export const seedSampleTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tasks = await StorageService.seedUserTasks(userId);

    res.status(201).json({
      success: true,
      message: 'Sample tasks loaded successfully',
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    next(err);
  }
};
