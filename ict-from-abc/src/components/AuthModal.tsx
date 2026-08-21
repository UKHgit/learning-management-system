import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, loading } = useAuth();

  if (!isOpen) return null;

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-[#E63A12] to-orange-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
          >
            <UserPlus className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to ICT From ABC
          </h2>
          <p className="text-gray-600">
            Sign in to access your learning portal and start your journey
          </p>
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-[#E63A12] hover:bg-orange-50 transition-all duration-300 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.766 12.2764c0-.8902-.0791-1.7337-.2196-2.539H12v4.7847h6.5925c-.2871 1.5382-1.1586 2.8383-2.4683 3.7119v3.0913h3.9628c2.3153-2.1272 3.6625-5.2683 3.6625-9.0489z"
              />
              <path
                fill="#34A853"
                d="M12 24.0002c3.3242 0 6.1102-1.0974 8.146-2.97l-3.9628-3.0913c-1.1033.7405-2.516 1.1773-4.1832 1.1773-3.2158 0-5.9388-2.1712-6.9096-5.0942H1.0277v3.208C3.0785 21.2709 7.2693 24.0002 12 24.0002z"
              />
              <path
                fill="#FBBC05"
                d="M5.0905 14.022c-.2462-.7404-.3867-1.5292-.3867-2.3448s.1405-1.6044.3867-2.3448V6.1239H1.0277C.3716 7.4305 0 8.9147 0 10.5002s.3716 3.0697 1.0277 4.3763l4.0628-3.1545z"
              />
              <path
                fill="#EA4335"
                d="M12 4.8764c1.8129 0 3.4405.6233 4.7255 1.845l3.5513-3.5513C18.1262 1.1565 15.2492 0 12 0 7.2693 0 3.0785 2.7293 1.0277 6.7602l4.0628 3.1545c.9708-2.923 3.6938-5.0942 6.9096-5.0942z"
              />
            </svg>
            <span className="font-semibold text-gray-700 group-hover:text-[#E63A12] transition-colors">
              Continue with Google
            </span>
          </motion.button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Secure & Free</span>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-4">
            <h4 className="font-semibold text-[#E63A12] mb-2">Why sign in?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Access all video lessons</li>
              <li>✓ Download PDF tutorials</li>
              <li>✓ Track your progress</li>
              <li>✓ Join live Zoom sessions</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
