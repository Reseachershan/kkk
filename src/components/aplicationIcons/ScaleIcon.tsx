import React from 'react';
import Svg, {Path} from 'react-native-svg';

const StatsIcon = ({width = 55, height = 55, color = 'black'}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 55 55" fill="none">
      <Path
        d="M24.9873 23.9024L25.2848 22.5084L31.6166 23.74L32.2776 23.8685L32.4157 23.2131L34.7386 12.1988L34.9908 11.0026L33.8368 11.4294L31.2637 12.3813L30.8203 12.5453L30.8187 13.0144L30.805 16.962H29.3106L29.329 11.7016L36.2244 8.92698C36.4411 8.91558 36.6244 8.88065 36.7681 8.85326L36.7817 8.85065C36.9633 8.81611 37.0832 8.79476 37.2248 8.79476C37.9527 8.79476 38.6141 9.18645 39.0838 9.85657L40.4909 12.0123C41.6579 13.9593 43.8764 15.3599 46.5145 15.5672L46.5097 16.9392C43.8361 16.7601 41.4426 15.5378 39.8539 13.7852L38.9595 12.7985L38.6816 14.1003L37.8107 18.1797L37.7303 18.5566L38.0157 18.8164L40.7835 21.335L40.7513 30.56H39.2569L39.2832 23.0769L39.2841 22.7789L39.0634 22.578L36.0748 19.8584L35.223 19.0834L34.9523 20.2015L33.6561 25.5549L24.9873 23.9024ZM41.5556 4.7196C41.5516 5.81604 40.595 6.76352 39.3736 6.76352C38.152 6.76352 37.2019 5.81604 37.2059 4.7196C37.2097 3.62315 38.1663 2.67567 39.3879 2.67567C40.6093 2.67567 41.5594 3.62315 41.5556 4.7196Z"
        fill={color}
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M3.83301 33.3847L4.13062 31.9907L10.4623 33.2222L11.1232 33.3507L11.2615 32.6954L13.5843 21.681L13.8366 20.4847L12.6825 20.9116L10.1093 21.8635L9.6661 22.0274L9.66445 22.4966L9.65065 26.4442H8.15636L8.17476 21.1838L15.0702 18.4092C15.2868 18.3978 15.4701 18.3628 15.6139 18.3355L15.6276 18.3328C15.809 18.2984 15.929 18.277 16.0706 18.277C16.7984 18.277 17.4598 18.6687 17.9295 19.3388L19.3366 21.4946C20.5036 23.4415 22.7221 24.8422 25.3602 25.0493L25.3555 26.4215C22.6818 26.2423 20.2883 25.02 18.6996 23.2674L17.8052 22.2807L17.5273 23.5824L16.6565 27.6619L16.576 28.0389L16.8615 28.2987L19.6293 30.8173L19.597 40.0422H18.1028L18.1289 32.5591L18.1299 32.2612L17.9091 32.0603L14.9205 29.3407L14.0687 28.5655L13.798 29.6838L12.5018 35.037L3.83301 33.3847ZM20.4013 14.2018C20.3975 15.2983 19.4408 16.2457 18.2193 16.2457C16.9977 16.2457 16.0477 15.2983 16.0516 14.2018C16.0554 13.1054 17.012 12.1579 18.2336 12.1579C19.455 12.1579 20.4051 13.1054 20.4013 14.2018Z"
        fill={color}
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M5.04199 50.6486L9.12533 47.2703L13.8892 43.2162H16.6114L17.9725 40.5135H24.0975H25.4587L30.2225 38.4865H32.2642V35.1081H37.7087L39.0698 33.0811L40.4309 31.7297L44.5142 28.3513H52.0003"
        stroke={color}
        strokeWidth={3}
      />
    </Svg>
  );
};
export default StatsIcon;
