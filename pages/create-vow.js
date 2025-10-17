import ProtectedRoute from '../components/ProtectedRoute';
import CreateVowContent from '../components/CreateVowContent';

export default function CreateVow() {
  return (
    <ProtectedRoute>
      <CreateVowContent />
    </ProtectedRoute>
  );
}
