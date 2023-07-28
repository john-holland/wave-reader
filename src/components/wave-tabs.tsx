import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {Children, FunctionComponent, ReactNode, useState} from "react";

type ReactNodeChildren = ReactNode | ReactNode[];
interface TabPanelProps {
    children?: ReactNodeChildren;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: any): object {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

// @ts-ignore
const WaveTabs: FunctionComponent<SelectorProps> = ({ children }: TabPanelProps) => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    // @ts-ignore
    const arrayChildren = !!children ? Children.toArray(children) : [];

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {arrayChildren.map((c: ReactNode, i) => {
                        if (!c) {
                            return (<Tab label={"unknown"} key={i}/>);
                        }
                        // @ts-ignore
                        return (<Tab label={c.props['tab-name'] || `tab-error-${i}`} key={i} {...a11yProps(i)} />);
                    })}
                </Tabs>
            </Box>
            {arrayChildren.map((c, i) => {
                return (<TabPanel value={value} index={i} key={i}>
                    {c}
                </TabPanel>);
            })}
        </Box>
    );
}

export default WaveTabs;