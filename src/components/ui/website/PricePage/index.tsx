'use client';

import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Box,
} from '@mui/material';
import { Plus } from 'lucide-react';
import { useGetFaqQuery } from '@/redux/slice/settingApi';


const faqs = [
  {
    question: 'What is included in the Premium Membership?',
    answer:
      'Premium membership gives you access to unlimited investment posts, secure messaging, verified investors, advanced filters, and priority support.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes, you can cancel your subscription at any time. There are no hidden fees or long-term commitments.',
  },
  {
    question: 'Is my identity protected?',
    answer:
      'Absolutely. We provide anonymous identity protection to ensure your privacy and safety.',
  },
  {
    question: 'Do I need KYC verification?',
    answer:
      'Yes, KYC verification is required to ensure a trusted and secure investor network.',
  },
  {
    question: 'How does the investor network work?',
    answer:
      'You get access to a verified network where you can connect, communicate, and explore investment opportunities.',
  },
  {
    question: 'Will I receive notifications?',
    answer:
      'Yes, you will receive email notifications for important updates and activities.',
  },
];

const FAQPage = () => {
  const {data: faqData} = useGetFaqQuery({});

  console.log("faqData", faqData);
  
  return (
    <Box sx={{ background: '#0A0A0A', minHeight: '100vh', color: 'white' }}>
      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 12, md: 16 },
          pb: 6,
          background: 'linear-gradient(to bottom, black, #0A0A0A)',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            Frequently Asked{' '}
            <span className='text-primary'>Questions</span>
          </Typography>

          <Typography variant="h6" sx={{ color: '#bbb' }}>
            Everything you need to know about our platform
          </Typography>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ pb: 10 }}>
        {faqData?.length ? faqData.map((faq:any, index:number) => (
          <Accordion
            key={index}
            disableGutters
            sx={{
              background: '#111',
              color: 'white',
              mb: 2,
              borderRadius: '12px !important',
              border: '1px solid rgba(255,255,255,0.1)',
              '&:before': { display: 'none' },
              transition: '0.3s',
              '&:hover': {
                borderColor: 'var(--primary)',
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <Plus className="w-5 h-5 text-primary" />
              }
            >
              <Typography sx={{ fontWeight: 500 }}>
                {faq.question}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography sx={{ color: '#aaa' }}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        )): (
          <Typography sx={{ color: '#aaa' }}>
            No FAQs available.
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default FAQPage;