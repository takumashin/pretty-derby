import React from 'react';
import { HashRouter as Router, Route ,Link} from 'react-router-dom';

import {Image,Button,Popover} from 'antd'
import { Drawer, List, NavBar, Icon } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.min.css';

import db from './db.js'
import t from './components/t.js'

import Race from './pages/race.js'
import Player from './pages/player.js'
import Support from './pages/support.js'
import NurturingMO2 from './pages-mo/nurturing.js'
import Skill from './pages/skill.js'
import SeedMo from './pages-mo/seed.js'

import SupportDetail from './components/support-detail.js'
import PlayerDetail from './components/player-detail.js'
import {BuffList} from './components/buff.js'

const cdnServer = 'https://cdn.jsdelivr.net/gh/wrrwrr111/pretty-derby/public/'
class App1 extends React.Component {
  state = {
    open: false,
    title:'urara win'
  }

  onOpenChange=()=>{
    this.setState({open: !this.state.open})
  }
  onSelect = (label) => {
    this.setState({title:label});
    this.onOpenChange()
  }
  reload =()=>{
    db.set('selected',{
      supports:{1:{},2:{},3:{},4:{},5:{},6:{}},
      player:{},
      races:[]
    }).write()
    // db.set('myDecks',[]).write()
  }
  render() {
    db.set('ua','mo').write();
    const routers = [{path:'/',label:'角色'},
    {path:'/support',label:'支援卡'},
    {path:'/skill',label:'技能'},
    {path:'/race',label:'比赛'},
    {path:'/nurturing2',label:'育成new'},
    {path:'/seed',label:'种马分享'}]
    const linkList=(<List>
      {routers.map(item=>
        <Link to={item.path} key={item.path}  onClick={()=>this.onSelect(item.label)}>
          <List.Item >{t(item.label)}</List.Item>
        </Link>
      )}

      <List.Item style={{marginTop:200}}>
      <iframe title="GitHub" src="https://ghbtns.com/github-btn.html?user=wrrwrr111&repo=pretty-derby&type=star&count=true&size=large&v=2" frameBorder="0" scrolling="0" width="160px" height="30px"></iframe>
      </List.Item>
      <List.Item>
      <Popover content={<><Image src={cdnServer+'img/q.jpg'} width={300}></Image><p>{t('闲聊为主')}</p></>}>
        <a target="_blank" rel="noreferrer" href="https://qm.qq.com/cgi-bin/qm/qr?k=f2Q2MIqkkxiiYq-sfRYmI7E4v17-r3V2&jump_from=webapi">
          <Button placement="bottom">{t('加入QQ群')}</Button>
        </a>
      </Popover>
      </List.Item>
      <List.Item>
      <Popover content={<><Image src={cdnServer+'img/z.jpg'} width={200}></Image><p>{t('支付宝')}</p></>}>
        <Button placement="bottom">{t('捐助')}</Button>
      </Popover>
      </List.Item>
      <List.Item>
        <Button placement="bottom" onClick={this.reload}>{t('初始化育成')}</Button>
      </List.Item>
    </List>)

    return (
    <Router>
      <NavBar icon={<Icon type="ellipsis" />} onLeftClick={this.onOpenChange}>{this.state.title}</NavBar>
      <Drawer
        className="my-drawer"
        style={{
          minHeight: document.documentElement.clientHeight,
          position: 'relative',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch'}}
        enableDragHandle={true}
        contentStyle={{ color: '#A6A6A6', textAlign: 'center',paddingTop:20}}
        // dragHandleStyle={{width:0}}
        sidebar={linkList}
        open={this.state.open}
        onOpenChange={this.onOpenChange}
      >
          <Route exact path="/" component={Player}/>
          <Route path="/support" component={Support}/>
          <Route path="/skill" component={Skill}/>
          <Route path="/nurturing2" component={NurturingMO2}/>
          <Route path="/seed" component={SeedMo}/>
          <Route path="/race" component={Race}/>
          <Route path="/support-detail/:supportId" component={SupportDetail}/>
          <Route path="/player-detail/:id/:nur" component={PlayerDetail}/>
          <Route path="/buff" component={BuffList}/>
      </Drawer>
    </Router>);
  }
}
export default App1


