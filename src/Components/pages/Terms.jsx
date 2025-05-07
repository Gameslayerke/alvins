import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditionsPopup = ({ isOpen, termsContent, onIAgreeChecked }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"> {/* Increased opacity, added padding */}
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"> {/* Softer rounded corners, stronger shadow, flex column layout, max height */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50"> {/* Added subtle border color, background color, and flex for potential future close button */}
          <h2 className="text-2xl font-bold text-gray-800"> {/* Larger, bolder title */}
            Terms and Conditions
          </h2>
          {/* Optional: Add a close button here */}
          {/* <button className="text-gray-500 hover:text-gray-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button> */}
        </div>
        <div className="px-6 py-6 overflow-y-auto flex-grow custom-scrollbar"> {/* Added flex-grow to fill space, custom-scrollbar class */}
          {termsContent.map((section, index) => (
            <section key={index} className="mb-6 pb-4 border-b last:border-b-0 border-gray-100"> {/* Increased bottom margin, added subtle bottom border for separation, removed border on last section */}
              {section.title && (
                <h3 className="text-xl font-semibold text-gray-800 mb-3"> {/* Slightly larger, more margin below */}
                  {section.title}
                </h3>
              )}
              {section.content && ( // Added conditional rendering for content
                 <p className="text-gray-700 leading-relaxed mb-3"> {/* Added bottom margin to paragraph */}
                    {section.content}
                 </p>
              )}
              {section.list && (
                <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700"> {/* Increased left padding, added space between list items, applied text color */}
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between"> {/* Added top border, background color, and justify-between for potential button placement */}
          <div className="flex items-center">
            <input
              id="agreeCheckbox" // Added an ID for better accessibility
                type="checkbox"
                className="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mr-3 cursor-pointer"
                onChange={(e) => onIAgreeChecked(e.target.checked)}
              />
              <label htmlFor="agreeCheckbox" className="text-sm text-gray-700 cursor-pointer">}
              I agree to the terms and conditions
            </label>
          </div>
          {/* Optional: Add an "Agree and Continue" button here */}
          {/* <button
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            onClick={() => { if (isChecked) navigate('/register'); }} // Assuming you track isChecked state
            // disabled={!isChecked} // Disable until checked
          >
            Agree and Continue
          </button> */}
        </div>
      </div>
    </div>
  );
};

// Add this CSS to your global stylesheet or a CSS module
// This provides a more aesthetically pleasing scrollbar for the terms content
/*
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f7f7f7; // Light gray track
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db; // Gray thumb
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af; // Darker gray on hover
}
*/


const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  const handleIAgreeChecked = (isChecked) => {
    // You might want to store the agreement state or navigate conditionally
    // For this example, we'll keep the direct navigation for demonstration
    if (isChecked) {
      navigate('/register');
    }
  };

  const termsAndConditionsContent = [
    {
      title: 'Introduction',
      content:
        'These Terms and Conditions govern your use of Quickcart (the "Site", "we", "us", or "our") and the services, features, content or applications we offer (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms.',
    },
    {
      title: 'Acceptance of Terms',
      content:
        'Please read these Terms carefully before using the Services. If you do not agree to all of these Terms, do not access or use the Services.',
    },
    {
      title: 'User Accounts',
      content:
        'You may need to register for an account to access some of our Services. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
    },
    {
      title: 'How We Collect and Use Your Personal Information',
      content:
        'We collect and have collected personal information about you from various sources. The information we collect varies depending on how you interact with us.',
      list: [
        'Basic contact details including your name, address, phone number, email.',
        'Order information including billing address, shipping address, payment confirmation, email address.',
        'Account information including your username, password, security questions.',
        'Shopping information such as items viewed or added to your cart or wishlist.',
        'Customer support information such as messages you send us.',
      ],
    },
    {
      title: 'How We Use Your Personal Information',
      list: [
        'To provide products and services, including processing payments and fulfilling orders.',
        'For marketing and advertising purposes to send promotions or personalized ads.',
        'To detect and prevent fraud and malicious activity.',
        'For customer support and improving our services.',
      ],
    },
    {
      title: 'Cookies',
      content:
        'We use cookies to improve your experience on our site. Cookies help us remember your actions and preferences, and may also be used by third parties to tailor services or ads. You can control cookie settings through your browser settings, but disabling cookies may affect your user experience.',
    },
    {
      title: 'How We Disclose Personal Information',
      content:
        'We may disclose your personal information to third parties for legitimate purposes, such as to our service providers and payment processors, to comply with legal obligations, or to protect our rights.',
    },
    {
      title: 'Intellectual Property',
      content:
        'The content and materials available through the Services are protected by copyright, trademark, and other intellectual property laws.',
    },
    {
      title: 'Limitation of Liability',
      content:
        'To the maximum extent permitted by applicable law, Quickcart shall not be liable for any indirect, incidental, special, consequential or punitive damages.',
    },
  ];

  // Since the popup is always open on this page, we render it directly.
  // In a real application, the isOpen state would likely be managed elsewhere.
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4"> {/* Added min-h-screen, background color, centering */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Quickcart</h1>
        <p className="text-gray-600">Please review our terms and conditions below to proceed.</p>
      </div>

      <TermsAndConditionsPopup
        isOpen={true} // Always open for this page as per original logic
        termsContent={termsAndConditionsContent}
        onIAgreeChecked={handleIAgreeChecked}
      />
    </div>
  );
};

export default PrivacyPolicyPage;