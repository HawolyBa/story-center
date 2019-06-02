
import Home from './components/home/Home'
import Profile from './components/profile/Profile'
import Profile2 from './components/profile/Profile2'
import PrivateProfile from './components/profile/PrivateProfile'


import Character from './components/character/Character'
import AddCharacter from './components/addCharacter/AddCharacter'
import EditCharacter from './components/addCharacter/EditCharacter'

import Story from './components/story/Story'
import Chapter from './components/story/chapter/Chapter'
import AddStory from './components/story/addStory/AddStory'
import EditStory from './components/story/addStory/EditStory'
import AddChapter from './components/story/addChapter/AddChapter'
import EditChapter from './components/story/addChapter/EditChapter'

import Archive from './components/archive/Archive'


import Privacy from './components/links/Privacy'
import Contact from './components/links/Contact'

import Guidances from './components/static/Guidances';
import Notifications from './components/notifications/Notifications';


export const routes = [
  { path: '/', exact: true, Component: Home },
  { path: '/rules', exact: true, Component: Guidances },
  { path: '/profile/:id', exact: false, Component: Profile },
  { path: '/character/edit/:id', exact: false, Component: EditCharacter },
  { path: '/character/:id', exact: false, Component: Character },
  { path: '/story/:id/edit', exact: false, Component: EditStory },
  { path: '/story/:id/chapter/:chapid/edit', exact: false, Component: EditChapter },
  { path: '/story/:id/chapter/:chapid', exact: false, Component: Chapter },
  { path: '/story/:id/add', exact: false, Component: AddChapter },
  { path: '/story/:id', exact: false, Component: Story },
  { path: '/categories/:catid', exact: false, Component: Archive },
  { path: '/browse', exact: true, Component: Archive },
  { path: '/contact', exact: true, Component: Contact },
  { path: '/privacy', exact: true, Component: Privacy }
]

export const protectedRoutes = [
  { path: '/profile', exact: true, Component: PrivateProfile },
  { path: '/profile2', exact: true, Component: Profile2 },
  { path: '/notifications', exact: true, Component: Notifications },
  { path: '/character/add', exact: true, Component: AddCharacter },
  { path: '/story/add', exact: true, Component: AddStory }
]