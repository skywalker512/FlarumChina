import {extend} from 'flarum/extend'
import app from 'flarum/app'
import AddAttributes from 'Reflar/gamification/components/AddAttributes'
import AddHotnessFilter from 'Reflar/gamification/components/AddHotnessSort'
import AddVoteButtons from 'Reflar/gamification/components/AddVoteButtons'
import Rank from 'Reflar/gamification/models/Rank'
import RankingsPage from 'Reflar/gamification/components/RankingsPage'
import VoteNotification from 'Reflar/gamification/components/VoteNotification'

app.initializers.add('Reflar-gamification', app => {
  app.store.models.ranks = Rank

  app.notificationComponents.vote = VoteNotification

  app.routes.rankings = {path: '/rankings', component: RankingsPage.component()}

  AddVoteButtons()
  AddHotnessFilter()
  AddAttributes()
})
