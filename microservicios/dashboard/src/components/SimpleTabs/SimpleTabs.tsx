import React from 'react';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';

interface TabObject {
  title: String,
  page: React.ReactElement
}

interface Props {
  tabObjects: TabObject[]
}

const SimpleTabs: React.FC<Props> = ({ tabObjects }) => {
  const [activeTabKey, setActiveTabKey ] = React.useState(0);
  
  const handleTabClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: number | String) => {
      setActiveTabKey((typeof tabIndex === "string" ? Number.parseInt(tabIndex): tabIndex) as number);
    };
    let eventKey = 0;
    return (
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} isBox={false} >
          {
            tabObjects.map( o => <Tab key={eventKey} eventKey={eventKey++} title={<TabTitleText>{o.title}</TabTitleText>}>{o.page}</Tab>)
          }
        </Tabs>
    );
  }

  export default SimpleTabs