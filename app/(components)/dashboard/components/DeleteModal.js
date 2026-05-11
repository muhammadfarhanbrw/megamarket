'use client';

import { TrashIcon } from '@heroicons/react/24/outline';

export default function DeleteModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
        <div className="mx-auto bg-red-100 rounded-full h-12 w-12 flex items-center justify-center mb-4">
          <TrashIcon className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 bg-red-600 text-white py-2 rounded-lg">Delete</button>
          <button onClick={onCancel} className="flex-1 border rounded-lg py-2">Cancel</button>
        </div>
      </div>
    </div>
  );
}