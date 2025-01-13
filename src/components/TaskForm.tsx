import React, { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Input = styled.input`
  padding: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 5px;
`;

interface TaskFormProps {
  initialText?: string;
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialText = '', onSubmit, onCancel }) => {
  const [text, setText] = useState(initialText);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter task..."
      />
      <ButtonGroup>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </ButtonGroup>
    </Form>
  );
};

export default TaskForm;

