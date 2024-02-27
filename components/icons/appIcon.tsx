import { Icon, IconProps } from '@chakra-ui/react';

export const AppIcon: React.FC<IconProps> = ({ css, ...props }) => (
  <Icon viewBox="0 0 82 24" width="82px" height="24px" {...props}>
    <path
      fill="url(#paint0_linear_877_13755)"
      d="M23.52 6.518a8.366 8.366 0 01-2.523 5.965l-5.723 5.608a.49.49 0 01-.707-.01 8.356 8.356 0 01-2.162-5.609 8.366 8.366 0 012.524-5.965l5.229-5.124C20.629.92 21.4.918 21.8 1.44a8.343 8.343 0 011.72 5.077z"
    ></path>
    <path
      fill="url(#paint1_linear_877_13755)"
      d="M20.781 22.553c-.42.507-1.19.502-1.66.04l-3.23-3.18a.493.493 0 01.002-.707l5.364-5.256c.198-.195.521-.196.696.019.931 1.144 1.297 2.725 1.02 4.466-.253 1.593-1.027 3.213-2.192 4.618z"
    ></path>
    <path
      fill="url(#paint2_linear_877_13755)"
      d="M3.045 12.517A8.366 8.366 0 01.521 6.552a8.343 8.343 0 011.721-5.077c.4-.523 1.171-.52 1.642-.058l5.23 5.124a8.366 8.366 0 012.523 5.965 8.356 8.356 0 01-2.162 5.609.49.49 0 01-.706.01l-5.724-5.608z"
    ></path>
    <path
      fill="url(#paint3_linear_877_13755)"
      d="M4.92 22.627c-.47.463-1.239.467-1.66-.04-1.164-1.405-1.938-3.024-2.192-4.618-.277-1.74.09-3.322 1.02-4.466.175-.215.499-.214.697-.02l5.364 5.258a.493.493 0 01.001.706l-3.23 3.18z"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_877_13755"
        x1="12.021"
        x2="12.021"
        y1="1.042"
        y2="18.463"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9F87FF"></stop>
        <stop offset="1" stopColor="#8566FF"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_877_13755"
        x1="12.021"
        x2="12.021"
        y1="13.099"
        y2="22.953"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DE99F6"></stop>
        <stop offset="1" stopColor="#D669FC"></stop>
      </linearGradient>
      <linearGradient
        id="paint2_linear_877_13755"
        x1="12.021"
        x2="12.021"
        y1="1.042"
        y2="18.463"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9F87FF"></stop>
        <stop offset="1" stopColor="#8566FF"></stop>
      </linearGradient>
      <linearGradient
        id="paint3_linear_877_13755"
        x1="12.021"
        x2="12.021"
        y1="13.099"
        y2="22.953"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DE99F6"></stop>
        <stop offset="1" stopColor="#D669FC"></stop>
      </linearGradient>
    </defs>
  </Icon>
);
