const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters long');
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('Please provide a valid email address');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('Please provide a valid registered email');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  next();
};

export const validateTask = (req, res, next) => {
  const { title, dueDate, status, priority } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Task title is required');
  } else if (title.trim().length > 120) {
    errors.push('Task title cannot exceed 120 characters');
  }

  if (!dueDate) {
    errors.push('Task due date is required');
  } else {
    const parsed = new Date(dueDate);
    if (isNaN(parsed.getTime())) {
      errors.push('Invalid due date format');
    }
  }

  if (status && !['Pending', 'In Progress', 'Completed'].includes(status)) {
    errors.push('Status must be Pending, In Progress, or Completed');
  }

  if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
    errors.push('Priority must be Low, Medium, or High');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Task validation failed',
      errors,
    });
    return;
  }

  next();
};
