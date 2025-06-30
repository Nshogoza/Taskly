import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  DocumentData,
  QuerySnapshot,
  Timestamp,
} from 'firebase/firestore';

export interface Task {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const TASKS_COLLECTION = 'tasks';

export async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
    ...task,
    completed: false,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function getTasks(userId: string): Promise<Task[]> {
  const q = query(collection(db, TASKS_COLLECTION), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
}

export async function updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>) {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await updateDoc(taskRef, { ...updates, updatedAt: Timestamp.now() });
}

export async function deleteTask(taskId: string) {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(taskRef);
}

export function subscribeToTasks(userId: string, callback: (tasks: Task[]) => void) {
  const q = query(collection(db, TASKS_COLLECTION), where('userId', '==', userId));
  return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const tasks: Task[] = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
    callback(tasks);
  });
} 