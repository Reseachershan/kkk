import * as React from 'react';
import {AppRegistry} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {Text} from 'react-native';
//import { Provider as StoreProvider } from 'react-redux';
//import store from "./src/redux/store";
import {name as appName} from './app.json';
import App from './App';
import {UserProvider} from './src/contexts/userContext.tsx';
import {WorkOutProvider} from './src/contexts/workOutContext.tsx';
import {GeoProvider} from './src/contexts/GeoContext';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

export default function Main() {
  return (
    <WorkOutProvider>
      <UserProvider>
        <GeoProvider>
          <PaperProvider>
            <App />
          </PaperProvider>
        </GeoProvider>
      </UserProvider>
    </WorkOutProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
