import {
  createAppContainer,
  createStackNavigator,
  createDrawerNavigator,
  createBottomTabNavigator,
} from 'react-navigation'
import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import { Icon, Text, Badge } from 'react-native-elements'

import LoginScreen from 'App/Containers/Login/LoginScreen'
import SignupScreen from 'App/Containers/Login/SignupScreen'
import SplashScreen from 'App/Containers/SplashScreen/SplashScreen'
import { Colors, Images, Helpers } from 'App/Theme'
import DrawerMenu from './DrawerMenu'
import MeetPeople from 'App/Containers/MeetPeople/MeetPeople'
import MyPicks from 'App/Containers/MyPicks/MyPicks'
import Messages from 'App/Containers/Messages/Messages'
import PickedMe from 'App/Containers/PickedMe/PickedMe'
import MyProfile from 'App/Containers/MyProfile/MyProfile'
import Subscription from 'App/Containers/Subscription/Subscription'
import ViewedProfiles from 'App/Containers/ViewedProfiles/ViewedProfiles'
import ViewedMe from 'App/Containers/ViewedMe/ViewedMe'
import Winks from 'App/Containers/Winks/Winks'
import Notifications from 'App/Containers/Notifications/Notifications'
import WebView from 'App/Containers/WebView/WebView'
import SendBugReport from 'App/Containers/SendBugReport/SendBugReport'
import ContactUs from 'App/Containers/ContactUs/ContactUs'
import Message from 'App/Containers/Message/Message'
import Profile from 'App/Containers/Profile/Profile'
import OnlineUsers from 'App/Containers/OnlineUsers/OnlineUsers'
import SearchFilter from 'App/Containers/SearchFilter/SearchFilter'
import VideoChat from 'App/Containers/VideoChat/VideoChat'
import DrawerLabel from 'App/Navigators/DrawerLabel'
import MessageIcon from 'App/Navigators/MessageIcon'

// class HomeScreen extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>Home!</Text>
//       </View>
//     )
//   }
// }

// HomeStackNavigator.navigationOptions = ({ navigation }) => {
//   let tabBarVisible
//   if (navigation.state.routes.length > 1) {
//     navigation.state.routes.map((route) => {
//       if (route.routeName === 'CustomHide') {
//         tabBarVisible = false
//       } else {
//         tabBarVisible = true
//       }
//     })
//   }

//   return {
//     tabBarVisible,
//   }
// }

const defaultStackNavigationOptions = {
  // headerStyle: {
  //   backgroundColor: Colors.primary,
  // },
  // headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
}

const drawerHeaderLeft = (navigation) => (
  <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
    <Icon name="menu" size={35} underlayColor={'#64b5f6'} />
  </TouchableOpacity>
)

const DrawerTextStyle = (tintColor) => ({
  fontWeight: 'bold',
  marginVertical: 15,
  color: tintColor,
})

const createDrawerLabel = (text, badge, tintColor) => (
  <View style={Helpers.row}>
    <Text style={DrawerTextStyle(tintColor)}>{text}</Text>
    {badge > 0 && <Badge value={`${badge}`} status="error" />}
  </View>
)

const MeetScreen = createBottomTabNavigator(
  {
    Home: createStackNavigator(
      {
        HomeScreen: {
          screen: MeetPeople,
          navigationOptions: ({ navigation }) => ({
            title: 'Meet People', // Title to appear in status bar
            headerLeft: drawerHeaderLeft(navigation),
          }),
        },
      },
      {
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <Image source={Images.bottomLineHome} style={{ tintColor }} />
          ),
        },
        defaultNavigationOptions: defaultStackNavigationOptions,
      }
    ),
    PickedMe: createStackNavigator(
      {
        PickedMe: {
          screen: PickedMe,
          navigationOptions: ({ navigation }) => ({
            title: 'Speed Dating Likes', // Title to appear in status bar
            headerLeft: drawerHeaderLeft(navigation),
            headerBackTitle: ' ',
          }),
        },
        Profile: {
          screen: Profile,
          navigationOptions: ({ navigation }) => ({
            headerBackTitle: ' ',
          }),
        },
      },
      {
        navigationOptions: ({ navigation }) => {
          let tabBarVisible = true
          if (navigation.state.index > 0) {
            tabBarVisible = false
          }

          return {
            tabBarVisible,
            tabBarLabel: 'Who Picked Me',
            tabBarIcon: ({ tintColor }) => (
              <Image source={Images.bottomLineWhoPickedMe} style={{ tintColor }} />
            ),
          }
        },
        defaultNavigationOptions: defaultStackNavigationOptions,
      }
    ),
    Messages: createStackNavigator(
      {
        Messages: {
          screen: Messages,
          navigationOptions: ({ navigation }) => ({
            title: 'Messages', // Title to appear in status bar
            headerLeft: drawerHeaderLeft(navigation),
            headerBackTitle: ' ',
          }),
        },
        Message: {
          screen: Message,
          navigationOptions: ({ navigation }) => ({
            headerBackTitle: ' ',
          }),
        },
        Profile: {
          screen: Profile,
          navigationOptions: ({ navigation }) => ({
            headerBackTitle: ' ',
          }),
        },
      },
      {
        navigationOptions: ({ navigation }) => {
          let tabBarVisible = true
          if (navigation.state.index > 0) {
            tabBarVisible = false
          }

          return {
            tabBarVisible,
            tabBarIcon: ({ tintColor }) => <MessageIcon tintColor={tintColor} />,
          }
        },
        defaultNavigationOptions: defaultStackNavigationOptions,
      }
    ),
    MyPicks: createStackNavigator(
      {
        MyPicks: {
          screen: MyPicks,
          navigationOptions: ({ navigation }) => ({
            title: 'My Picks', // Title to appear in status bar
            headerLeft: drawerHeaderLeft(navigation),
            headerBackTitle: ' ',
          }),
        },
        Profile: {
          screen: Profile,
          navigationOptions: ({ navigation }) => ({
            headerBackTitle: ' ',
          }),
        },
        VideoChat: {
          screen: VideoChat,
          navigationOptions: ({ navigation }) => ({
            headerBackTitle: ' ',
          }),
        },
      },
      {
        navigationOptions: ({ navigation }) => {
          let tabBarVisible = true
          if (navigation.state.index > 0) {
            tabBarVisible = false
          }

          return {
            tabBarVisible,
            tabBarLabel: 'My Picks',
            tabBarIcon: ({ tintColor }) => (
              <Image source={Images.speedDatingGameMyPicksMenuIcon} style={{ tintColor }} />
            ),
          }
        },
        defaultNavigationOptions: defaultStackNavigationOptions,
      }
    ),
  },
  {
    tabBarOptions: {
      activeTintColor: Colors.destructive,
    },
    navigationOptions: {
      drawerIcon: ({ focused, tintColor }) => (
        <Image source={Images.favouritesMenuIcon} style={{ tintColor }} />
      ),
    },
  }
)

const DrawerContainer = createDrawerNavigator(
  {
    Meet: MeetScreen,
    OnlineUsers: createStackNavigator(
      {
        OnlineUsers: {
          screen: OnlineUsers,
          navigationOptions: ({ navigation }) => ({
            headerLeft: drawerHeaderLeft(navigation),
            headerBackTitle: ' ',
          }),
        },
        SearchFilter: {
          screen: SearchFilter,
          navigationOptions: ({ navigation }) => ({
            title: 'Search Christian Filipina', // Title to appear in status bar
          }),
        },
        Profile: {
          screen: Profile,
          navigationOptions: ({ navigation }) => ({
            headerBackTitle: ' ',
          }),
        },
        VideoChat: {
          screen: VideoChat,
        },
        Message: {
          screen: Message,
        },
      },
      {
        navigationOptions: {
          title: 'Online Users',
          drawerIcon: ({ focused, tintColor }) => (
            <Image source={Images.viewedProfilesMenuIcon} style={{ tintColor }} />
          ),
        },
        defaultNavigationOptions: defaultStackNavigationOptions,
      }
    ),
    MyProfile: createStackNavigator(
      {
        MyProfile: {
          screen: MyProfile,
          navigationOptions: ({ navigation }) => ({
            title: 'My Profile', // Title to appear in status bar
            headerLeft: drawerHeaderLeft(navigation),
          }),
        },
      },
      {
        navigationOptions: {
          title: 'My Profile',
          drawerIcon: ({ focused, tintColor }) => (
            <Image source={Images.myProfileMenuIcon} style={{ tintColor }} />
          ),
        },
        defaultNavigationOptions: defaultStackNavigationOptions,
      }
    ),
    Subscription: createStackNavigator(
      {
        Subscription: {
          screen: Subscription,
          navigationOptions: ({ navigation }) => ({
            title: 'Subscription', // Title to appear in status bar
            headerLeft: drawerHeaderLeft(navigation),
          }),
        },
      },
      {
        navigationOptions: {
          title: 'Subscription',
          drawerIcon: ({ focused, tintColor }) => (
            <Image source={Images.settingsMenuIcon} style={{ tintColor }} />
          ),
        },
        defaultNavigationOptions: defaultStackNavigationOptions,
      }
    ),
    ViewedProfiles: createStackNavigator(
      {
        ViewedProfiles: {
          screen: ViewedProfiles,
          navigationOptions: ({ navigation }) => ({
            title: 'Viewed profiles', // Title to appear in status bar
            headerLeft: drawerHeaderLeft(navigation),
            headerBackTitle: ' ',
          }),
        },
        Profile: {
          screen: Profile,
          navigationOptions: ({ navigation }) => ({
            headerBackTitle: ' ',
          }),
        },
      },
      {
        navigationOptions: {
          title: 'Viewed profiles',
          drawerIcon: ({ focused, tintColor }) => (
            <Image source={Images.viewedProfilesMenuIcon} style={{ tintColor }} />
          ),
        },
        defaultNavigationOptions: defaultStackNavigationOptions,
      }
    ),
    ViewedMe: createStackNavigator(
      {
        ViewedMe: {
          screen: ViewedMe,
          navigationOptions: ({ navigation }) => ({
            title: 'Who viewed me', // Title to appear in status bar
            headerLeft: drawerHeaderLeft(navigation),
            headerBackTitle: ' ',
          }),
        },
        Profile: {
          screen: Profile,
          navigationOptions: ({ navigation }) => ({
            headerBackTitle: ' ',
          }),
        },
      },
      {
        navigationOptions: {
          drawerIcon: ({ focused, tintColor }) => (
            <Image source={Images.whoViewedMeMenuIcon} style={{ tintColor }} />
          ),
          drawerLabel: ({ focused, tintColor }) => (
            <DrawerLabel text="Who viewed me" tintColor={tintColor} label="unread_views" />
          ),
        },
        defaultNavigationOptions: defaultStackNavigationOptions,
      }
    ),
    WinksReceived: createStackNavigator(
      {
        WinksReceived: {
          screen: Winks,
          navigationOptions: ({ navigation }) => ({
            title: 'Winks', // Title to appear in status bar
            headerLeft: drawerHeaderLeft(navigation),
            headerBackTitle: ' ',
          }),
        },
        Profile: {
          screen: Profile,
          navigationOptions: ({ navigation }) => ({
            headerBackTitle: ' ',
          }),
        },
      },
      {
        navigationOptions: {
          drawerIcon: ({ focused, tintColor }) => (
            <Image source={Images.winksMenuIcon} style={{ tintColor }} />
          ),
          drawerLabel: ({ focused, tintColor }) => (
            <DrawerLabel text="Winks received" tintColor={tintColor} label="unread_winks" />
          ),
        },
        defaultNavigationOptions: defaultStackNavigationOptions,
      }
    ),
    Notifications: createStackNavigator(
      {
        Notifications: {
          screen: Notifications,
          navigationOptions: ({ navigation }) => ({
            title: 'Notifications', // Title to appear in status bar
            headerLeft: drawerHeaderLeft(navigation),
          }),
        },
      },
      {
        navigationOptions: {
          drawerIcon: ({ focused, tintColor }) => (
            <Image source={Images.messageMenuIcon} style={{ tintColor }} />
          ),
          drawerLabel: ({ focused, tintColor }) =>
            createDrawerLabel('My Notifications', 0, tintColor),
        },
        defaultNavigationOptions: defaultStackNavigationOptions,
      }
    ),
    Messages: createStackNavigator(
      {
        Messages: {
          screen: Messages,
          navigationOptions: ({ navigation }) => ({
            title: 'Messages', // Title to appear in status bar
            headerLeft: drawerHeaderLeft(navigation),
            headerBackTitle: ' ',
          }),
        },
        Message: {
          screen: Message,
        },
      },
      {
        navigationOptions: {
          drawerIcon: ({ focused, tintColor }) => (
            <Image source={Images.messageMenuIcon} style={{ tintColor }} />
          ),
          drawerLabel: ({ focused, tintColor }) => (
            <DrawerLabel text="Messages" tintColor={tintColor} label="unread_messages" />
          ),
        },
        defaultNavigationOptions: defaultStackNavigationOptions,
      }
    ),
    AdviceArticles: createStackNavigator(
      {
        AdviceArticles: {
          screen: WebView,
          navigationOptions: ({ navigation }) => ({
            title: 'Advice Articles', // Title to appear in status bar
            headerLeft: drawerHeaderLeft(navigation),
          }),
        },
      },
      {
        navigationOptions: {
          title: 'Advice Articles',
          drawerIcon: ({ focused, tintColor }) => (
            <Image source={Images.adviceArticlesMenuIcon} style={{ tintColor }} />
          ),
        },
        defaultNavigationOptions: defaultStackNavigationOptions,
      }
    ),
    Testimonials: createStackNavigator(
      {
        Testimonials: {
          screen: WebView,
          navigationOptions: ({ navigation }) => ({
            title: 'Testimonials', // Title to appear in status bar
            headerLeft: drawerHeaderLeft(navigation),
          }),
        },
      },
      {
        navigationOptions: {
          title: 'Testimonials',
          drawerIcon: ({ focused, tintColor }) => (
            <Image source={Images.myProfileMenuIcon} style={{ tintColor }} />
          ),
        },
        defaultNavigationOptions: defaultStackNavigationOptions,
      }
    ),
    SendBugReport: createStackNavigator(
      {
        SendBugReport: {
          screen: SendBugReport,
          navigationOptions: ({ navigation }) => ({
            title: 'Send Problem Report', // Title to appear in status bar
            headerLeft: drawerHeaderLeft(navigation),
          }),
        },
      },
      {
        navigationOptions: {
          title: 'Send Bug Report',
          drawerIcon: ({ focused, tintColor }) => (
            <Image source={Images.settingsMenuIcon} style={{ tintColor }} />
          ),
        },
        defaultNavigationOptions: defaultStackNavigationOptions,
      }
    ),
    ContactUs: createStackNavigator(
      {
        ContactUs: {
          screen: ContactUs,
          navigationOptions: ({ navigation }) => ({
            title: 'Contact Us', // Title to appear in status bar
            headerLeft: drawerHeaderLeft(navigation),
          }),
        },
      },
      {
        navigationOptions: {
          title: 'Contact Us',
          drawerIcon: ({ focused, tintColor }) => (
            <Image source={Images.contactUsMenuIcon} style={{ tintColor }} />
          ),
        },
        defaultNavigationOptions: defaultStackNavigationOptions,
      }
    ),
  },
  {
    drawerLockMode: 'locked-closed',
    initialRouteName: 'Meet',
    contentComponent: DrawerMenu,
    contentOptions: {
      activeTintColor: Colors.destructive,
      inactiveTintColor: Colors.text,
      itemsContainerStyle: {
        margin: 0,
        padding: 0,
      },
      labelStyle: {
        marginLeft: 0,
      },
    },
    // overlayColor: 'white',
  }
)

/**
 * The root screen contains the application's navigation.
 *
 * @see https://reactnavigation.org/docs/en/hello-react-navigation.html#creating-a-stack-navigator
 */
const StackNavigator = createStackNavigator(
  {
    SplashScreen,
    LoginScreen,
    SignupScreen,
    DrawerContainer: {
      screen: DrawerContainer,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      },
    },
    PrivacyPolicy: {
      screen: WebView,
      navigationOptions: {
        title: 'Privacy Policy', // Title to appear in status bar
      },
    },
    TermsOfService: {
      screen: WebView,
      navigationOptions: {
        title: 'Terms of Service', // Title to appear in status bar
      },
    },
    ContactUs: {
      screen: ContactUs,
      navigationOptions: {
        title: 'Contact Us', // Title to appear in status bar
      },
    },
  },
  {
    // By default the application will show the splash screen
    initialRouteName: 'SplashScreen',
    // See https://reactnavigation.org/docs/en/stack-navigator.html#stacknavigatorconfig
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
)

export default createAppContainer(StackNavigator)
