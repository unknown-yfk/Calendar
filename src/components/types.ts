export interface Task {
    id: string;
    text: string;
    date: string;
    labelIds: string[];
  }
  
  export interface Label {
    id: string;
    name: string;
    color: string;
  }
  
  export const labels: Label[] = [
    { id: '1', name: 'Work', color: '#4CAF50' },
    { id: '2', name: 'Personal', color: '#2196F3' },
    { id: '3', name: 'Important', color: '#FF9800' },
    { id: '4', name: 'Urgent', color: '#F44336' },
  ];
  
  export interface Holiday {
    date: string;
    localName: string;
    name: string;
    countryCode: string;
    fixed: boolean;
    global: boolean;
    type: string;
  }
  
  