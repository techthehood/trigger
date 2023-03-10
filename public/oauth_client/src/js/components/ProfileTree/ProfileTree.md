
SimpleTree data format

```
  const SimpleTree = (props) => {

  const { 
    item_data,
    edit = false,
    edit_callback,
    delete_callback
  } = props;

  const {
    id,
    title,
    description,
    tool = "default",
    url,
    image,
    config,
  } = item_data;

  ...
```
- the SimpleTree component recieves an "item_data" prop
- I need ProfileTree to be able to accept external data w/o running a request

#### profile tree sample item_data

```
  const ProfileTree = (props) => {

    const {
      id,
      image,
      default_image,
      username,
      data = {ids:[],data:{}},
      // store,
      header = true,
      edit = false,
    } = props;

    const [linkTree, setLinkTree] = useState({...data});
    ...
```

```
  let link_els = linkTree.ids.map((entry, ndx) => {
    let link_data = {};
    link_data.item_data = linkTree.data[`${entry}`];
    link_data.item_data.id = entry;
    // needs edit and delete data
    if(edit){
      link_data.edit = edit;
      link_data.edit_callback = display_form;
      link_data.delete_callback = unDoIt;
    }

    let {title, description, tool, url, image, config} = link_data.item_data;

    return <SimpleTree {...link_data} key={`pTree_link${entry}_${ndx}`}/>;
  });
```