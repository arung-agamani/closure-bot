export interface AKCharData {
  name: string;
  description: string;
  canUseGeneralPotentialItem: boolean;
  potentialItemId: string;
  team: number;
  displayNumber: string;
  tokenKey?: null;
  appellation: string;
  position: string;
  tagList?: string[] | null;
  displayLogo: string;
  itemUsage: string;
  itemDesc: string;
  itemObtainApproach: string;
  isNotObtainable: boolean;
  maxPotentialLevel: number;
  rarity: number;
  profession: string;
  trait?: null;
  phases?: PhasesEntity[] | null;
  skills?: SkillsEntity[] | null;
  talents?: TalentsEntity[] | null;
  potentialRanks?: PotentialRanksEntity[] | null;
  favorKeyFrames?: AttributesKeyFramesEntityOrFavorKeyFramesEntity[] | null;
  allSkillLvlup?: AllSkillLvlupEntity[] | null;
}
export interface PhasesEntity {
  characterPrefabKey: string;
  rangeId: string;
  maxLevel: number;
  attributesKeyFrames?:
    | AttributesKeyFramesEntityOrFavorKeyFramesEntity[]
    | null;
  evolveCost?: EvolveCostEntityOrLevelUpCostEntityOrLvlUpCostEntity[] | null;
}
export interface AttributesKeyFramesEntityOrFavorKeyFramesEntity {
  level: number;
  data: Data;
}
export interface Data {
  maxHp: number;
  atk: number;
  def: number;
  magicResistance: number;
  cost: number;
  blockCnt: number;
  moveSpeed: number;
  attackSpeed: number;
  baseAttackTime: number;
  respawnTime: number;
  hpRecoveryPerSec: number;
  spRecoveryPerSec: number;
  maxDeployCount: number;
  maxDeckStackCnt: number;
  tauntLevel: number;
  massLevel: number;
  baseForceLevel: number;
  stunImmune: boolean;
  silenceImmune: boolean;
  sleepImmune: boolean;
}
export interface EvolveCostEntityOrLevelUpCostEntityOrLvlUpCostEntity {
  id: string;
  count: number;
  type: string;
}
export interface SkillsEntity {
  skillId: string;
  overridePrefabKey?: null;
  overrideTokenKey?: null;
  levelUpCostCond?: LevelUpCostCondEntity[] | null;
  unlockCond: UnlockCondOrUnlockCondition;
}
export interface LevelUpCostCondEntity {
  unlockCond: UnlockCondOrUnlockCondition;
  lvlUpTime: number;
  levelUpCost?: EvolveCostEntityOrLevelUpCostEntityOrLvlUpCostEntity[] | null;
}
export interface UnlockCondOrUnlockCondition {
  phase: number;
  level: number;
}
export interface TalentsEntity {
  candidates?: CandidatesEntity[] | null;
}
export interface CandidatesEntity {
  unlockCondition: UnlockCondOrUnlockCondition;
  requiredPotentialRank: number;
  prefabKey: string;
  name: string;
  description: string;
  rangeId?: null;
  blackboard?: BlackboardEntity[] | null;
}
export interface BlackboardEntity {
  key: string;
  value: number;
}
export interface PotentialRanksEntity {
  type: number;
  description: string;
  buff?: Buff | null;
  equivalentCost?: null;
}
export interface Buff {
  attributes: Attributes;
}
export interface Attributes {
  abnormalFlags?: null;
  abnormalImmunes?: null;
  abnormalAntis?: null;
  abnormalCombos?: null;
  abnormalComboImmunes?: null;
  attributeModifiers?: AttributeModifiersEntity[] | null;
}
export interface AttributeModifiersEntity {
  attributeType: number;
  formulaItem: number;
  value: number;
  loadFromBlackboard: boolean;
  fetchBaseValueFromSourceEntity: boolean;
}
export interface AllSkillLvlupEntity {
  unlockCond: UnlockCondOrUnlockCondition;
  lvlUpCost?: EvolveCostEntityOrLevelUpCostEntityOrLvlUpCostEntity[] | null;
}
