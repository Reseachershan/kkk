import { StartWorkOut } from './src/components/StartWorkOut';
import About from './src/screens/About';
import Klimb from './src/screens/Home/Klimb';
import Leaderboard from './src/screens/Home/Leaderboard';
import Onboarding from './src/screens/Home/Onboarding';
import Onboarding2 from './src/screens/Home/Onboarding2';
import Onboarding3 from './src/screens/Home/Onboarding3';
import Stats from './src/screens/Home/Stats';
import Klimber from './src/screens/Klimber';
import KlimbFinished from './src/screens/KlimbFinished';
import KlimbSummary1 from './src/screens/KlimbSummary1';
import KlimbSummary2 from './src/screens/KlimbSummary2';
import KlimbSummary3 from './src/screens/KlimbSummary3';
import KlimbSummaryPicker from './src/screens/KlimbSummaryPicker';
import Profile from './src/screens/Profile';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import Splash from './src/screens/Splash';
import TabBar from './src/screens/TabBar';
import {fadeAnimation, noAnimation} from './src/utils/FadeAnimation';
import {horizontalAnimation} from './src/utils/HorizontalAnimation';
export const TabBarRoutes = [
  {name: 'Stats', component: Stats, options: noAnimation},
  {name: 'Klimb', component: Klimb, options: fadeAnimation},
  {name: 'Leaderboard', component: Leaderboard, options: noAnimation},
];
export const NoAuthRoutes = [
  {name: 'Splash', component: Splash},
  {name: 'SignIn', component: SignIn, options: fadeAnimation},
  {name: 'SignUp', component: SignUp, options: fadeAnimation},
];
export const WithAutRoutes = [
  {name: 'About', component: About, options: horizontalAnimation},
  {name: 'TabBar', component: TabBar, options: fadeAnimation},
  {name: 'Profile', component: Profile},
  {name: 'Onboarding', component: Onboarding},
  {name: 'Onboarding2', component: Onboarding2},
  {name: 'Onboarding3', component: Onboarding3},
  {name: 'Klimber', component: Klimber},
  {name: 'KlimbFinished', component: KlimbFinished},
  {name: 'KlimbSummaryPicker', component: KlimbSummaryPicker},
  {name: 'KlimbSummary1', component: KlimbSummary1, options: fadeAnimation},
  {name: 'KlimbSummary2', component: KlimbSummary2, options: fadeAnimation},
  {name: 'KlimbSummary3', component: KlimbSummary3, options: fadeAnimation},
];
