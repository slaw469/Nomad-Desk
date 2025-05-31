import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './aboutstyles/Faq.css';  // Capital F to match the actual filename

interface FaqItem {
  question: string;
  answer: string;
}

const Faq: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqItems: FaqItem[] = [
    {
      question: 'What is Nomad Desk?',
      answer: 'Nomad Desk is a platform I created to help UT Dallas students and faculty find the best study and work spaces on campus. It allows you to discover, filter, and book workspaces based on your specific needs - whether you need quiet focus areas, group collaboration rooms, or spaces with specific amenities.',
    },
    {
      question: 'How do I find a workspace?',
      answer: "Finding a workspace is simple! Just search for spaces in your desired campus building, browse through the options, and select the one that fits your needs. You can filter by amenities like power outlets, Wi-Fi strength, noise level, and available hours. Once you've found the perfect spot, you can save it to favorites or book it instantly.",
    },
    {
      question: 'Is this an official UTD service?',
      answer: "Nomad Desk is an independent project I developed as a UT Dallas student. While it's not an official university service, I've designed it specifically with UTD students in mind, focusing on campus facilities and nearby study locations. I'm always open to collaboration with university departments to enhance the service.",
    },
    {
      question: 'Can I create a study group?',
      answer: "Absolutely! Nomad Desk allows you to create and manage study groups with your classmates. You can schedule study sessions, invite friends, and book appropriate spaces that accommodate your group size. It's perfect for project teams, study groups, or just coordinating with friends who want to work together.",
    },
    {
      question: 'How can I provide feedback?',
      answer: "I'm always looking for feedback to improve Nomad Desk! You can submit suggestions through the app's feedback form, email me directly, or even reach out on campus. As a fellow student, I'm particularly interested in hearing how Nomad Desk can better serve our UTD community and what features would make your study experience better.",
    },
  ];

  return (
    <section className="faq">
      <div className="container">
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            Get answers to common questions about Nomad Desk.
          </p>
        </div>

        <div className="faq-list">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="faq-item"
            >
              <button
                className={`faq-question ${expandedFaq === index ? 'active' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <h3>{item.question}</h3>
                {expandedFaq === index
                  ? <ChevronUp className="faq-icon" />
                  : <ChevronDown className="faq-icon" />}
              </button>
              {expandedFaq === index && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
