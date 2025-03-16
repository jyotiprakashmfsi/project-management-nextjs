import mongoose, { Schema, Document, Model } from 'mongoose';

// User Interface
export interface IUser extends Document {
  id: number;
  fname: string;
  email: string;
  password: string;
  contact?: string;
  dob?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Project Interface
export interface IProject extends Document {
  id: number;
  name: string;
  description?: string;
  status: string;
  created_by: number;
  createdAt: Date;
  updatedAt: Date;
}

// ProjectUser Interface
export interface IProjectUser extends Document {
  id: number;
  user_id: number;
  project_id: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Task Interface
export interface ITask extends Document {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  status: string;
  end_time?: Date;
  assigned_to: number;
  task_json?: any;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const UserSchema: Schema = new Schema({
  id: { type: Number, required: true},
  fname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String },
  dob: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Project Schema
const ProjectSchema: Schema = new Schema({
  id: { type: Number, required: true},
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'active' },
  created_by: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ProjectUser Schema
const ProjectUserSchema: Schema = new Schema({
  id: { type: Number, required: true},
  user_id: { type: Number, required: true },
  project_id: { type: Number, required: true },
  role: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Task Schema
const TaskSchema: Schema = new Schema({
  id: { type: Number, required: true},
  project_id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'pending', required: true },
  end_time: { type: Date },
  assigned_to: { type: Number, required: true },
  task_json: { type: Schema.Types.Mixed },
  priority: { type: String, default: 'low', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create and export models
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export const ProjectUser: Model<IProjectUser> = mongoose.models.ProjectUser || mongoose.model<IProjectUser>('ProjectUser', ProjectUserSchema);
export const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
