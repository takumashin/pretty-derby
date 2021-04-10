import React,{useState} from 'react';
import db from '../db.js'

import { Row,Col,Popover,Button,Image,Checkbox,Divider,Input,Tooltip,Switch } from 'antd';
import t from './t.js'
const cdnServer = 'https://cdn.jsdelivr.net/gh/wrrwrr111/pretty-derby/public/'

const ua = db.get('ua').value();
const { Search } = Input

const SkillList = (props)=>{
  const skillList = props.skillList

  return (
    <Row gutter={0}>
      {skillList.map((skillId,index)=>
        <Col span={12} key={index}>
          <SkillButton id={skillId} usedInList={true}>
        </SkillButton>
      </Col>)}
    </Row>
  )
}
const skillType={
  1:'速度属性',
  2:'耐力属性',
  3:'力量属性',
  4:'毅力属性',
  5:'智力属性',
  6:'体力',
  7:'体力消耗',
  8:'视野',
  9:'体力恢复',
  10:'出栏时机',
  14:'掛かり结束时间',
  21:'瞬时速度',
  27:'目标速度',
  28:'走位速度',
  31:'加速度',
}
const SkillButton = (props)=>{
  const skill = props.skill || db.get('skills').find({id:props.id}).value()
  const inListStyleOverride = {
    borderRadius:'8px',
    color:'#303030',
    width:'96%',
    justifyContent:'flex-start'
  }
  const skillNameStyle = {
    width:`calc(96% - 34px)`,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    textAlign:'justify'
  }
    return(
      <Popover
        trigger={ua==='mo'?'click':'hover'}
        content={<>
      <p>{t('技能名称')+ ':  ' +t(skill.name)}</p>
      <p>{t('技能描述')+ '： ' +skill.describe}</p>
      <p>{t('技能描述')+ '： ' +t(skill.describe)}</p>
      <p>{skill.condition}</p>
      <p>{t('触发条件')+ '： ' +t(skill.condition)}</p>
      {/* <p>{t('技能效果')+ '： ' +skill.ability_value/10000}</p> */}
      <p>{`${t('技能效果')}：\xa0
        ${skill.ability.map(ability=>skillType[ability.type]+' '+ability.value/10000)}`}</p>
      <p>{`${t('持续时间')}： ${skill.ability_time/10000}s*${t('赛道长度')}/1000`}</p>
      <p>{`${t('冷却时间')}： ${skill.cooldown/10000}s*${t('赛道长度')}/1000`}</p>
      {/* <p>技能效果 = (技能数值 / 100)%</p> */}
      {/* <p>持续时间 = 基础持续时间 * 赛道长度 / 1000</p> */}
      {/* <p>冷却时间 = 基础冷却时间 * 赛道长度 / 1000</p> */}
      </>} title={skill.name}
      >
        <Button type={'primary'} className={'skill-btn skill-btn-'+skill.rarity} style={props.usedInList?{...inListStyleOverride}:{}} onClick={()=>props.onClick&&props.onClick(skill)}>
          <div style={props.usedInList?
            {display:'flex',position:'absolute',top:4,left:8,width:'100%'}:{width:'100%'}}>
          <Image src={cdnServer+skill.imgUrl} preview={false} width={26}></Image>
          <div style={{...skillNameStyle}}>{`\xa0\xa0${skill.name}`}</div>
          </div>
        </Button>
      </Popover>
    )
}

const SkillCheckbox = (props)=>{
  const allSkillList = db.get('skills').orderBy('db_id').value()

  const [checkedList1, setCheckedList1] = useState([]);
  const [checkedList2, setCheckedList2] = useState([]);
  const [checkedList3, setCheckedList3] = useState([]);
  // init isOwn
  localStorage.getItem('isOwn')===null&&localStorage.setItem('isOwn',0)
  const [isOwn,setIsOwn] = useState(parseInt(localStorage.getItem('isOwn')))
  const mySupports = db.get('mySupports').value()
  const mySkillList = new Set(mySupports.reduce((list,supportId)=>{
    let support = db.get('supports').find({id:supportId}).value()
    return list.concat(support.skillList)
  },[]))
  const checkOptions1 = [
    {label:'短距',value:'＜短距離＞'},
    {label:'英里',value:'＜マイル＞'},
    {label:'中距',value:'＜中距離＞'},
    {label:'长距',value:'＜長距離＞'},
    {label:'逃',value:'＜作戦・逃げ＞'},
    {label:'先',value:'＜作戦・先行＞'},
    {label:'差',value:'＜作戦・差し＞'},
    {label:'追',value:'＜作戦・追込＞'},
    {label:'通用',value:'normal'},
  ]
  const checkOptions2 =[
    {label:'速度被动(绿)',value:'10011'},
    {label:'耐力被动(绿)',value:'10021'},
    {label:'力量被动(绿)',value:'10031'},
    {label:'毅力被动(绿)',value:'10041'},
    {label:'智力被动(绿)',value:'10051'},
    {label:'耐力恢复(蓝)',value:'20021'},
    {label:'速度提高(黄)',value:'20011'},
    // {label:'20031',value:'20031'},
    {label:'加速度提高(黄)',value:'20041'},
    {label:'切换跑道(黄)',value:'20051'},
    {label:'起步(黄)',value:'20061'},
    // {label:'20071',value:'20071'},
    // {label:'20081',value:'20081'},
    {label:'视野(黄)',value:'20091'},
    {label:'降速(红)',value:'30011'},
    {label:'安定(红)',value:'30041'},
    {label:'疲劳(红)',value:'30051'},
    {label:'视野(红)',value:'30071'}
  ]
  const checkOptions3 = [
    {label:'普通',value:'ノーマル'},
    {label:'稀有',value:'レア'},
    {label:'独特',value:'固有'}
  ]
  const onChange1=(checkedValues)=>{
    setCheckedList1(checkedValues)
    updateSkillList(checkedValues,checkedList2,checkedList3,isOwn)
  }
  const onChange2 = (checkedValues)=>{
    setCheckedList2(checkedValues)
    updateSkillList(checkedList1,checkedValues,checkedList3,isOwn)
  }
  const onChange3 = (checkedValues)=>{
    setCheckedList3(checkedValues)
    updateSkillList(checkedList1,checkedList2,checkedValues,isOwn)
  }

  const updateSkillList = (check1,check2,check3,isOwn)=>{
    let tempSkillList = allSkillList
    if(check1.length){
      tempSkillList = tempSkillList.filter(skill=>{
        let flag = 0;
        check1.forEach(value=>{
          if(skill.describe){
            if(value==='normal' && skill.describe.indexOf('＜') === -1 && skill.describe.indexOf('＞') === -1){
              flag = 1
            }else if(skill.describe.indexOf(value)!==-1){
              flag = 1
            }
          }
        })
        return flag
      })
    }
    if(check2.length){
      tempSkillList = tempSkillList.filter(skill=>{
        let flag = 0;
        check2.forEach(value=>{
          let str = skill.icon_id +''
          if(str){
            if(str[0] === value[0] && str[3] === value[3] ){
              flag = 1
            }
          }
        })
        return flag
      })
    }
    if(check3.length){
      tempSkillList = tempSkillList.filter(skill=>{
        let flag = 0;
        check3.forEach(value=>{
          if(skill.rare === value){
            flag = 1
          }
        })
        return flag
      })
    }
    if(isOwn){
      tempSkillList = tempSkillList.filter(skill=>{
        return mySkillList.has(skill.id)
      })
    }
    if(check1.length||check2.length||check3.length||isOwn){
      tempSkillList.push({
        id:'default'
      })
    }
    if(props.needId){
      tempSkillList = tempSkillList.reduce((list,skill)=>{
        list.push(skill.id)
        return list
      },[])
    }
    props.onUpdate(tempSkillList)
  }
  const resetCheckbox=()=>{
    setCheckedList1([])
    setCheckedList2([])
    setCheckedList3([])
    props.onUpdate(allSkillList)
  }
  const changeMode = ()=>{
    let curValue = 1-isOwn
    localStorage.setItem('isOwn',curValue)
    setIsOwn(curValue)
    // console.log(curValue)
    updateSkillList(checkedList1,checkedList2,checkedList3,curValue)
  }
  const onSearch = (searchText) => {
    const fullSkillList = allSkillList;
    const tempSkillList = fullSkillList.filter(item => (item.name).indexOf(searchText) > -1);
    setCheckedList1([])
    setCheckedList2([])
    setCheckedList3([])
    props.onUpdate(tempSkillList)
  };
  return(<>{props.checkOnly?
    <>
     <Checkbox.Group options={checkOptions1} value={checkedList1} onChange={onChange1} />
      <Divider/>
      <Checkbox.Group options={checkOptions2} value={checkedList2} onChange={onChange2} />
      <Divider/>
      <Checkbox.Group options={checkOptions3} value={checkedList3} onChange={onChange3} />
    </>
    :
    <div>
        <div style={{height:16}}/>
        <Button type={'danger'} onClick={resetCheckbox} style={{width:'100%'}}>{t('重置')}
        </Button>
        <Divider/>
      <div>
          <Tooltip title={t("可以在支援卡页面配置")}>
          <span style={{ margin: '0 10px 0 0',lineHeight: '32px'}}>{t('显示拥有支援卡')}</span>
            <Switch checked={isOwn} onChange={changeMode} />
          </Tooltip>
      </div>
      <span style={{ margin: '0 10px 0 0',lineHeight: '32px'}}>{t('技能搜索')}</span>
      <Search
      placeholder={t("输入技能名称")}
      enterButton={t("搜索")}
      size="middle"
      style={{ width: '100%' }}
      onSearch={onSearch}
      />
      <Divider/>
      <Checkbox.Group options={checkOptions1} value={checkedList1} onChange={onChange1} />
      <Divider/>
      <Checkbox.Group options={checkOptions2} value={checkedList2} onChange={onChange2} />
      <Divider/>
      <Checkbox.Group options={checkOptions3} value={checkedList3} onChange={onChange3} />
    </div>}
    </>
  )
}
export {SkillList,SkillButton,SkillCheckbox}
