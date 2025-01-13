import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Task, Label, labels } from '../types/types';
import styles from '../styles/TaskModal.module.css';

interface TaskModalProps {
  task?: Task;
  date: string;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  date,
  onClose,
  onSave,
}) => {
  const [text, setText] = useState(task?.text || '');
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(task?.labelIds || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      text,
      date,
      labelIds: selectedLabelIds,
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>{task ? 'Edit Task' : 'New Task'}</h2>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter task description"
            required
            className={styles.input}
          />
          <div>
            <h3>Labels</h3>
            <div className={styles.labelGrid}>
              {labels.map(label => (
                <button
                  key={label.id}
                  type="button"
                  className={styles.labelButton}
                  style={{
                    borderColor: selectedLabelIds.includes(label.id) ? label.color : 'transparent',
                    background: `${label.color}10`,
                  }}
                  onClick={() => {
                    setSelectedLabelIds(prev =>
                      prev.includes(label.id)
                        ? prev.filter(id => id !== label.id)
                        : [...prev, label.id]
                    );
                  }}
                >
                  <span style={{ background: label.color }}></span>
                  {label.name}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className={styles.button}>
            {task ? 'Save Changes' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

