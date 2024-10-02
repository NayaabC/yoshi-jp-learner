import { Datagrid, List, ReferenceField, TextField } from "react-admin";

export const UnitList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="id"/>
                <TextField source="title"/>
                <TextField source="description"/>
                <ReferenceField source="topicId" reference="topics"/>
                <TextField source="order"/>
            </Datagrid>
        </List>
    )
};