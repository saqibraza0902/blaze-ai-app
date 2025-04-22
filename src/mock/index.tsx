import FinancialIcon from '../ui/icons/financial-icon';
import GeneralIcon from '../ui/icons/general-icon';
import HrIcon from '../ui/icons/hr-icon';
import MarketingIcon from '../ui/icons/marketing-icon';
import ProductionDevIcon from '../ui/icons/production-dev-icon';
import SaleIcon from '../ui/icons/sale-icon';
import SocialIcon from '../ui/icons/social-icon';
import UltraIcon from '../ui/icons/ultra-icon';
import WebIcon from '../ui/icons/web-icon';
import {Models} from '../utils/enums';

export const token = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjZmNjU3ZGRiYWJmYmZkOTVhNGVkNjZjMjMyNDExZWFhNjE5OGQ4NGMxYmJkOGEyYTI5M2I4MTVmYjRhOTlhYjEifQ.eyJpZCI6Im1lbV9jbTJuN3c1bngwMDlrMHN0cmgybnVldHAzIiwidHlwZSI6Im1lbWJlciIsImlhdCI6MTc0NTMwMDY3OSwiZXhwIjoxNzQ2NTEwMjc5LCJhdWQiOiJhcHBfY2x2cXR0ZW12MDB6YTBzcmcwdXMzaDR6ayIsImlzcyI6Imh0dHBzOi8vYXBpLm1lbWJlcnN0YWNrLmNvbSJ9.h-i0IhFD2dBq1V7ewioiNHNP6-KhNg9tzw_F71hSjRfLEq7S9l88amH1SlVYHfDVN5CqsvahJWgg4NxXvDYC2HeRPxVVjWcdGvNCNKBiyG8Nws582zB4hR4QrkR3lhKQsCiAzfltW8RYz7NiOPYG1Br19d0ztJgYxzNNPLzlhjqBowseF16AJqimR1m8_c0NJ9fLyDVy08lr8IbG66wFxK_YeCXMDeW6EgcJSTuUJClgCAGHiktIdfLyjKt8nPNUpRJtvCf9zWKNF1ApX8jEldry2vQmRCkDL6y9cF1mhyESNiLKClMsLhrvPjgRQd_MXaFLKze7Ro_rzXwXdJ-Gfg`;


export const FOCUS_MODES = [
  {
    Label: 'General',
    des: 'Your best all-around strategic business support',
    icon: GeneralIcon,
    value: 'General',
  },
  {
    Label: 'Marketing',
    des: 'Reach a greater audience with your brand',
    icon: MarketingIcon,
    value: 'Marketing',
  },
  {
    Label: 'Finance',
    des: 'Master Your financial planning and budgeting',
    icon: FinancialIcon,
    value: 'Finance',
  },
  {
    Label: 'HR',
    des: 'Recruitment,compliance and workplace culture',
    icon: HrIcon,
    value: 'HR',
  },
  {
    Label: 'Web',
    des: 'Let Blaze browse the web for advanced research',
    icon: WebIcon,
    value: 'Web',
  },
  {
    Label: 'Product dev.',
    des: 'Improve product creation and refinement for success',
    icon: ProductionDevIcon,
    value: 'Product Development',
  },
  {
    Label: 'Social Media',
    des: 'Create the best posts for maximum growth',
    icon: SocialIcon,
    value: 'Social Media',
  },
  {
    Label: 'Sales',
    des: 'Sell your products for maximum return',
    icon: SaleIcon,
    value: 'Sales',
  },

  {
    Label: 'Ultra',
    des: 'Experience next level performance for your toughest missions',
    icon: UltraIcon,
    value: 'Ultra',
  },
];
export const CasecadeItems = [
  {label: '3', value: 3},
  {label: '5', value: 5},
  {label: '7', value: 7},
  {label: '10', value: 10},
];
export const Delays = [
  {label: '0', value: 0},
  {label: '3', value: 3},
  {label: '5', value: 5},
  {label: '7', value: 7},
  {label: '10', value: 10},
  {label: '20', value: 20},
  {label: '30', value: 30},
];
export const NEWMODELS = [
  {
    title: 'Chat GPT',
    models: [
      {title: 'Chat GPT 4o Latest', value: Models.CHATGPT4OLATEST},
      {
        title: 'Chat GPT o1',
        value: Models.CHATGPTO1,
      },
      {
        title: 'Chat GPT o3 Mini',
        value: Models.CHATGPTO3MINI,
      },
    ],
  },

  {
    title: 'Claude',
    models: [
      {title: 'Claude 3 Opus', value: Models.CLAUDE3OPUS},
      {title: 'Claude 3.7 Sonnet Latest', value: Models.CLAUDE3_7SONNET},
      {title: 'Claude 3.5 Sonnet', value: Models.CLAUDE3SONNET},
    ],
  },

  {
    title: 'Perplexity',
    models: [
      {
        title: 'Sonar Reasoning Pro',
        value: Models.SONARPROREASONING,
      },
      {title: 'Sonar Pro', value: Models.SONARPRO},
      {
        title: 'Sonar',
        value: Models.SONAR,
      },
    ],
  },
];
