# VirtualScroll notes

## articles
[Build your Own Virtual Scroll - Part I](https://dev.to/adamklein/build-your-own-virtual-scroll-part-i-11ib)   
[code sandbox example of Build your Own ...](https://codesandbox.io/s/214p1911yn?from-embed)   
> the example has the most useful sample code which also includes "useScrollAware" hook   

<br/>

#### **how do i add a store to keep up with data changes and still keep the component neutral (composable - able to use in other apps?)**   
<br/>
there is an extrenal item that has to be passed in that could be linked to the store to get its data. idk how it can stay
current unless its parents are wrapped in a provider and i can use an observer in it.  hopefully its using a memo will keep it
from being re-rendered.   

<br/>

#### **the secret to using the virtual scroll**   

take the list elements and instead of using map to iterate through each one and render them
create a ListItem template that can recieve an item index.

```
  const ListItem = React.memo(({ index }) => {
    // console.warn(`updating [Item index]`,index);
    return(
    <div
      style={{
        height: 30,
        lineHeight: "30px",
        display: "flex",
        justifyContent: "space-between",
        padding: "0 10px"
      }}
      className="row"
      key={index}
    >
      <img
        alt={index}
        src={`http://lorempixel.com/30/30/animals/${(index % 10) + 1}`}
      />
      row index {index}
    </div>
  )});
```
use the index property to call the item data out of an array of items the same way as u would using map

then pass the List_items template to the VS component Item props
```
  <VirtualScroll
    name={"core_vscroller"}
    itemCount={order_ary.length}
    height={370}
    childHeight={85}
    Item={ListItem}
    renderAhead={renderCalc}
    padding={85/2}
    hide_scroll={true}
    restock={this.restock}
    loading={this.loading}
    has_more={has_more}
  />
```

to make the VS component infinite, pass a restock callback to the
restock props, the scroller will trigger the callback when the scroller's
remaining itemCount gets low.

as long as the main component is observing the data state changes the
scroller list will automatically recieve the additional data.


### GOTCHA: i am having an issue with the fps. i need to learn how to make tombstones (skeletons)
> i thought about trying to use useEffect and some later variable to trigger full data
otherwise show a limited data view or placeholder elements
> NOTE: there is a way to do skeletons with css

#### adding an IntersectionObserver
> lets me request data based off the accurate position of certain elements

#### set up references
```
  componentDidMount = () => {

    this.observer = createRef();
    this.last_restock = createRef();
    this.has_more = createRef();

  }//componentDidMount
```

#### set up IntersectionObserver

```
      observerSetupCallback = (node) => {
        // let fetch_me = this.fetch_info;

        // this.setState({loading: true});// loading causes an extra render

        // // console.warn(node);
        // if(this.state.loading == true) return;// if loading do nothing

        // if(this.observer.current) this.observer.current.disconnect();
        if(!exists(observer.current)){
          // i only need one observer
          this.observer.current = new IntersectionObserver( entries => {

            let index = Number(entries[0].target.dataset.ndx);
            let next_restock = this.next_restock.current;
            let last_restock = this.last_restock.current;
            // this.last_restock.current = index;

            if(entries[0].isIntersecting && index == next_restock){

              // // console.warn(`[observer] entry is intersecting`,entries[0].target);
              // // console.warn("visible");
              // this.fetch_info();
              // fetch_me();
              this.restock()
              .then(() => {
                // console.warn("[observer] setting restock current");
              });
            }else if(index <= last_restock){

              // this ends almost immediately after the last_restock is set because the observer is constantly checking.
              // // console.warn(`[observer] ending observation`,entries[0].target);
              this.observer.current.unobserve(entries[0].target);
            }

          },{/*rootMargin: "250px",*/ root: this.root_viewport.current});
          // this.observer_init.current = true;
        }

        if(node && this.has_more.current){
           this.observer.current.observe(node);
           this.next_restock.current = node.dataset.ndx;
         }
        // let last_restock = this.last_restock.current || 0;
        // if(node)

      }//observerSetupCallback
```

#### call ref callback on specific IntersectionObserver element
>instead of wrapping it around a list element i found a way to put it inside the list element container (in between element components)

```
  <List_li key={`${tVar.view_prefix}${ancestor}_${tVar.myIn_id}`} tVar={tVar} >
    {
      (index == ndx_calc) ? (
        <div className="list_item_wrapper" ref={this.observerSetupCallback} data-ndx={index} style={{border:"1px solid transparent"}}></div>
      ) : null
    }
    <AWrapr tVar={tVar} >
```
#### GOTCHA: IntersectionObserver element has to have some page presence through css styling.
```
  style={{border:"1px solid transparent"}}
```

#### GOTCHA: Resistance to scrolling up
**item must be strictly the height you added to the VirtualScroll component**
style.scss
```
  .arc_item_wrapper{
    height: 255px;
    margin: 5px;
  }
```

#### IntersectionObserver process


```
    if(node && this.has_more.current){
       this.observer.current.observe(node);
       this.next_restock.current = node.dataset.ndx;
     }
```

```
  let index = Number(entries[0].target.dataset.ndx);
  let next_restock = this.next_restock.current;
  let last_restock = this.last_restock.current;

  if(entries[0].isIntersecting && index == next_restock){

    this.restock()

  }else if(index <= last_restock){

    this.observer.current.unobserve(entries[0].target);
  }
```

```
  if(_this.last_cancel.current.cancelToken) _this.last_cancel.current.cancelToken;// cancel the last cancelToken if it exists

  return await get_data(scroll_options, state, _this.last_cancel.current)
  .then((result_obj) => {

    _this.last_restock.current = _this.next_restock.current;//this tells the observer what was completed

    _this.last_cancel.current = {};//reset the last_cancel

  });
```

#### for a custom height
- set an init ref
- after mounting force an update
- once updated detect the wrapper container and add a height
```
  constructor(props){
    super(props);

    this.init = createRef();
    this.init.current = false;
  }

  componentDidUpdate = () => {

    this.init.current = true;
    this.forceUpdate();

  }//componentDidUpdate

  if((exists(this.init.current))){
    let ul_el = document.querySelector(".ul_display_list");// doesn't exist yet
    // let ul_el = document.querySelector(".fldr_display");
    height = (ul_el) ? Math.floor(ul_el.getBoundingClientRect().height) : height;
  }

```
**it has to be done after a full render, maybe it can be set after component did mount because it forces another render**


#### detect the init being true and display the virtual scroll

```
  {(exists(this.init.current)) ?
  <VirtualScroll
    name={"core_vscroller"}
    prefix={this.state.view_prefix}
    itemCount={order_ary.length}
    height={height}
    childHeight={vScroll_child_height}
    Item={ListItem}
    renderAhead={this.state.renderAhead}
    padding={0}
    hide_scroll={true}
    observer={this.observerCallback}
    loading={this.loading}
    has_more={this.has_more.current}
    iUN={this.state.iUN}
  /> : null }
```

#### [RangeError: invalid array length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Invalid_array_length#:~:text=The%20JavaScript%20exception%20%22Invalid%20array,or%20equal%20to%20232.)   

test fix
```
  if(visibleNodeCount.length < 1){ 
    console.error('[VirtualScroll] WARNING: visibleNodeCount.length',visibleNodeCount.length); 
    return null;
  };
```

**if the array is 0 or a negative number return;**

can be negative with this
```
  visibleNodeCount = (itemCount < startNode) ? itemCount : Math.min(itemCount - startNode, visibleNodeCount);
```
it is taking the min - of the visibleNodeCount == 0 and itemCount (which could be 0) - startNode (which could be 1) would result in a -1 which is lower (min) than zero

**here is the fix**

```
  if(visibleNodeCount < 1 || isNaN(visibleNodeCount)){
    if(display_console || false) console.warn('[VirtualScroll] WARNING: visibleNodeCount.length',visibleNodeCount);
    // return null;
    visibleNodeCount = 0;
  };
```
> if its anything less than 1 or not a number which comes from an undefined or something else strange set it to zero

## Dynamic height
**who uses vScroll and how are heights calculated**
> ReactListItems & Arc

```
  <VirtualScroll
    name={"arc_scroll"}
    // prefix={"arc"}
    itemCount={state.list.length}
    height={height}
    childHeight={255}
    Item={list_data}
    renderAhead={renderAhead}
    padding={40}
    hide_scroll={true}
    observer={this.observerCallback}
    loading={loading}
    has_more={has_more}
    iUN={iUN}
    refresh={{callback:this.iconWall_callback, timer:1000, wait: true}}
  />
```
> currently the height comes from a set number of what each item should be
> if i feed the VirtualScroll a visible_area property, it should ignore its own height
> calculations and use what i sent in
- this number will also update as more items are added from the server.
- i can calculate this number cumulatively from the data store inside of create order as its parsing each item

- Narrator's dynamic height needs to be accessible from the parent component - it doesn't have to be
  a state var, it could be a ref. the reason being i need it to be readily accessible, not ready late.
- i could add it to the messages variable. so when i setState i can modify the height
- it needs a name

#### **VS render test**   
> i put a console log in useEffect/componentDidMount positions and render positions

```
// this.render_nbr = createRef();
// this.render_nbr.current = 0;
// if (display_console || false) console.debug('[Views] RNDR render_nbr', this.render_nbr.current);

[Views] CDU render_nbr 2
// render 3 triggered
[Views] new render_nbr 3

// final round of render 2
[VirtualScroll] UEF render_nbr 2
[VirtualScroll] RNDR render_nbr 2
[VirtualScroll] UEF render_nbr 2
[VirtualScroll] RNDR render_nbr 2
[VirtualScroll] UEF render_nbr 2

[Views] RNDR render_nbr 3
[VirtualScroll] RNDR render_nbr 3
[Views] CDU render_nbr 3
[VirtualScroll] UEF render_nbr 3

// final round of render 3
[Views] RNDR render_nbr 3
[VirtualScroll] RNDR render_nbr 3
[Views] CDU render_nbr 3
[VirtualScroll] UEF render_nbr 3
```
> Both renders fire in the order they were initiated, then both updates are registered


## flip docs   

### **GOTCHA** fix for observer top position fireing another request after each re-render   

_the answer was to restore the last scroll position which after re-render would be buried beneath new request content_   

> a flipped scroller puts the newest items on the bottom and oldest at the top
> the scrollHeight of th viewport increases with each new request, the distance from the bottom will be used as the 
> last known position and helps to recreate that same distance from the bottom no matter how much the scrollHeight/
> height of the element increases.

### flip processes

> during fetch_info the scrollBottom position is saved to be used alter to determine the viewers 
> last scroll position before the list was lengthened by a new request

_view.js > fetch info_

```
  // if flip, reverse the list id array data
  let list = views.state.flip ? [...result_ids.reverse(), ...prev.list] : [...prev.list, ...result_ids];

  if (state.flip && obj_exists(views.vscroll_ref,"current.force_scroll")){
    // save scroll position after calculating scrollTop distance from the bottom
    views.save_scroll_pos.current = views.vscroll_ref.current.getScrollBottom(views.vscroll_ref.current.viewport.current,true);
  }// if

  // if the request returns new list values, trigger a manual scroll in the VirtualScroll component
  if (state.flip && prevState.list.length != 0) {
    // only do this if it previously had value
    views.force_scroll.current = true;
  }// if flip
```


> if flip mode views forces VirtualScroll to scroll to saved scrollBottom position   

_views.js > componentDidUpdate_
```
  componentDidUpdate = () => {
    if(this.state.flip && this.force_scroll.current == true){

      this.vscroll_ref.current.force_scroll(this.save_scroll_pos.current);
      this.force_scroll.current = false;
    }// if
  }// componentDidUpdate
```

#### 