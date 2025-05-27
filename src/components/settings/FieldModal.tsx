import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: FormField) => void;
  field?: FormField;
}

export interface FormField {
  id?: number;
  name: string;
  label: string;
  type: string;
  required: boolean;
  enabled: boolean;
}

const fieldTypes = [
  { value: 'text', label: 'Texto' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Telefone' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Data' },
  { value: 'select', label: 'Seleção' },
  { value: 'textarea', label: 'Área de Texto' },
  { value: 'boolean', label: 'Sim/Não' }
];

const FieldModal: React.FC<FieldModalProps> = ({ isOpen, onClose, onSave, field }) => {
  const [formData, setFormData] = useState<FormField>(
    field || {
      name: '',
      label: '',
      type: 'text',
      required: false,
      enabled: true
    }
  );

  const [errors, setErrors] = useState<Partial<FormField>>({});

  const validateForm = () => {
    const newErrors: Partial<FormField> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (!/^[a-z0-9_]+$/.test(formData.name)) {
      newErrors.name = 'Nome deve conter apenas letras minúsculas, números e underscore';
    }
    
    if (!formData.label.trim()) {
      newErrors.label = 'Rótulo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {field ? 'Editar Campo' : 'Novo Campo'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Campo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full p-2 border rounded-md ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: nome_completo"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rótulo *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className={`w-full p-2 border rounded-md ${
                errors.label ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Nome Completo"
            />
            {errors.label && (
              <p className="text-red-500 text-sm mt-1">{errors.label}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo do Campo
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {fieldTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                className="rounded border-gray-300 text-church-primary focus:ring-church-primary"
              />
              <span className="text-sm text-gray-700">Campo Obrigatório</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="rounded border-gray-300 text-church-primary focus:ring-church-primary"
              />
              <span className="text-sm text-gray-700">Campo Ativo</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-church-primary rounded-md hover:bg-church-secondary"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldModal; 