import { Datagrid, List, TextField } from "react-admin";

export const TopicList = () => {
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="id"/>
                <TextField source="title"/>
                <TextField source="imageSrc"/>
            </Datagrid>
        </List>
    )
};