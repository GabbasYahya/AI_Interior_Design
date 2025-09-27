// AI Room Generation Service
// Status: Coming Soon

export interface RoomRequest {
  roomType: string;
  style: string;
}

export interface Room {
  id: string;
  imageUrl: string;
  description: string;
}

export class AIRoomService {
  generateRoom(request: RoomRequest): Promise<Room> {
    throw new Error('AI Room Generation - Coming Soon! Feature in development.');
  }
  
  isAvailable(): boolean {
    return false;
  }
}

export const aiRoomService = new AIRoomService();
