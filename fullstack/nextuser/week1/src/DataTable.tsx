import * as React from 'react';
import {Profile} from './lib/contracts/Profile'
import {Button} from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const DataTable = (props : {profiles:Profile[],ownerName:(val :string)=>string,account:string,remove:(string)=>void}) => {



  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profiles</h1>
      <Table className="min-w-full bg-white border border-gray-300">
        <TableHeader>
          <TableRow>
            <TableHead className="py-2 px-4 border-b">Name</TableHead>
            <TableHead className="py-2 px-4 border-b">Description</TableHead>
            <TableHead className="py-2 px-4 border-b">Owner</TableHead>
            <TableHead className="py-2 px-4 border-b">Operation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.profiles.map((item) => (
            <TableRow key={item.id.id} className="hover:bg-gray-100">
              <TableCell className="py-2 px-4 border-b">{item.name}</TableCell>
              <TableCell className="py-2 px-4 border-b">{item.description}</TableCell>
              <TableCell className="py-2 px-4 border-b">ownerNam({item.owner})</TableCell>
              <TableCell className="py-2 px-4 border-b">
                { props.account == item.owner  && <Button onClick={()=>{props.remove(item.id.id)}}>remove</Button> }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};









