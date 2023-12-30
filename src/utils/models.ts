import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMessage extends Document {
  _id: string;
  channelID: string;
  votes: number;
  content: string;
  sender: string;
}

const messageSchema = new Schema<IMessage>({
  _id: String, // .id
  channelID: String, // .channelId
  votes: Number, // rct.count
  content: String, // .content
  sender: String, // .author.username
}, { collection: 'messages' });

interface IArchive extends Document {
  _id: string;
  channelID: string;
  votes: number;
  content: string;
  sender: string;
}

const archiveSchema = new Schema<IArchive>({
  _id: String, // .id
  channelID: String, // .channelId
  votes: Number, // rct.count
  content: String, // .content
  sender: String, // .author.username
}, { collection: 'archive' });

interface IUser extends Document {
  _id: string;
  user: string;
  name: string;
  birthday: {
    month: string;
    day: string;
    year: string;
  };
}

const userSchema = new Schema<IUser>({
  _id: String, // .id
  user: String,
  name: String,
  birthday: {
    month: String,
    day: String,
    year: String,
  },
}, { collection: 'users' });

interface IEvent extends Document {
  _id: string;
  rsvp: string[];
  guildId: string;
  channelId: string;
  name: string;
  date: {
    month: string;
    day: string;
    year: string;
  };
  time: string;
  description: string;
  botText: string; // or date
}

const eventSchema = new Schema<IEvent>({
  _id: String,
  rsvp: [String],
  guildId: String,
  channelId: String,
  name: String,
  date: {
    month: String,
    day: String,
    year: String,
  },
  time: String,
  description: String,
  botText: String, // or date
}, { collection: 'events' });

interface IIsPollActive extends Document {
  _id: string;
  isPollActive: boolean;
  channelId: string;
  guildId: string;
}

const isPollActiveSchema = new Schema<IIsPollActive>({
  _id: String,
  isPollActive: Boolean,
  channelId: String,
  guildId: String,
});

const Message: Model<IMessage> = mongoose.model('Message', messageSchema);
const Archive: Model<IArchive> = mongoose.model('Archive', archiveSchema);
const User: Model<IUser> = mongoose.model('User', userSchema);
const Event: Model<IEvent> = mongoose.model('Event', eventSchema);
const IsPollActive: Model<IIsPollActive> = mongoose.model('IsPollActive', isPollActiveSchema);

export { Message, Archive, User, Event, IsPollActive };
