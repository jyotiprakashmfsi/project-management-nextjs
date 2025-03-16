import mongoose from 'mongoose';
import dbConnect from '../db/models/mongodb/connection';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

/**
 * Gets the next auto-incremented ID for a specific schema
 * @param schemaName - The name of the schema/collection for which to generate the ID
 * @returns Promise<number> - The next sequential ID starting from 1
 */
export async function getNextSequenceValue(schemaName: string): Promise<number> {
  await dbConnect();
  
  const Counter = mongoose.models.Counter || 
                  mongoose.model('Counter', counterSchema);
  
  try {
    const existingCounter = await Counter.findOne({ _id: schemaName });
    
    if (!existingCounter) {
      const newCounter = await Counter.create({
        _id: schemaName,
        seq: 1
      });
      return newCounter.seq;
    } else {
      const counter = await Counter.findOneAndUpdate(
        { _id: schemaName }, 
        { $inc: { seq: 1 } },
        { 
          new: true,
          upsert: true
        }
      );
      
      return counter.seq;
    }
  } catch (error) {
    console.error(`Error generating auto-increment ID for ${schemaName}:`, error);
    throw new Error(`Failed to generate ID for ${schemaName}`);
  }
}

export default getNextSequenceValue;