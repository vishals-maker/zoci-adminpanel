import { useState } from "react";
import CustomTable from "../common/CustomTable";
import CustomText from "../common/CustomText";
import SignatureUi from "./SignatureUi";
import UiCollection from "./UiCollection";

const CollectionTable=({setDeleteStatus,sentinelRef})=>{
    const [collectionId,setCollectionId]=useState("");

    const dataSource = [
  {
    key: '1',
    name: "",
    age: "",
  },
  
];


const columns = [
  {
    title:        <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Collection"}/>
,
    dataIndex: 'name',
    key: 'name',
    width:700,
    align:"start",
    justify:"start",
    render:()=>{return <UiCollection sentinelRef={sentinelRef} setDeleteStatus={setDeleteStatus} collectionId={collectionId} setCollectionId={setCollectionId}/>}
  },
  {
    title:  <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Products"}/>,
    dataIndex: 'age',
    key: 'age',
    width:700,
    render:()=>{return <SignatureUi collectionId={collectionId} />}

    
 
  }
];
    return(
        <>
       <CustomTable  dataSource={dataSource} columns={columns}/>
        </>
    )
}
export default CollectionTable;