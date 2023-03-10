const {exists, obj_exists} = require('../../tools/exists');

  export const observerSetupCallback = function(
    {
      node,
      observer,
      has_more,
      childHeight,
      renderAhead,
      restock,
      rootMargin: rtMarg,
      last_rootMargin,
      next_restock : nxt_res,
      last_restock : lst_res
    }
  ){

    let _this = this;
    let root_viewport,
    next_restock = nxt_res,
    last_restock = lst_res;
    // if its the same as the renderahead it will constantly render - it needs to be when the list is depleating and there are no more elemnts to add
    let rootMargin = (exists(rtMarg)) ? rtMarg : Math.max(0, childHeight * (renderAhead - 2));

    if(node) root_viewport = node.parentNode.parentNode.parentNode;

    // fix for issue of observer's root not being the exact same as the once currently available and visible onscreen
    let same_root = obj_exists(observer,"current.root") && observer.current.root == root_viewport ? true : false;

    let has_last_margin = (exists(last_rootMargin.current)) ? true : false;


    // this.setState({loading: true});// loading causes an extra render

    // // console.warn(node);
    // if(this.state.loading == true) return;// if loading do nothing

    // if(this.observer.current) this.observer.current.disconnect();
    // !obj_exists(observer,"current.root") fix for .root == null
    if(!exists(observer.current) || !obj_exists(observer,"current.root") || !same_root/*||  has_last_margin && rootMargin != last_rootMargin.current*/ ){
      // i only need one observer
      // this.root_viewport.current = document.querySelector(`.arc_scroll_viewport_${this.state.iUN}`);
      // if(this.observer.current) this.observer.current.disconnect();

      last_rootMargin.current = rootMargin;// helps dynamic resizing

      observer.current = new IntersectionObserver( entries => {

        let node_id = (entries[0].target.dataset.observer) ? entries[0].target.dataset.observer : Number(entries[0].target.dataset.ndx);//otherwise make sure its not a string
        // let next_restock = next_restock.current;
        // let last_restock = last_restock.current;
        // this.last_restock.current = node_id;

        if(entries[0].isIntersecting && (!isNaN(node_id) && node_id == next_restock.current || isNaN(node_id) && node_id == "loader") && has_more){

          // console.warn(`[observer] entry is intersecting`,entries[0].target);
          // // console.warn("visible");
          // this.fetch_info();
          // fetch_me();
          restock()
          .then(() => {
            // console.warn("[observer] setting restock current");
          });
        }else if(!isNaN(node_id) && node_id <= last_restock.current){

          // this ends almost immediately after the last_restock is set because the observer is constantly checking.
          // console.warn(`[observer] ending observation`,entries[0].target);
          // observer.current.unobserve(entries[0].target);
        }

        // console.warn(`[observer] intersectionRatio ${entries[0].intersectionRatio}`);

      },{rootMargin: `${rootMargin}px`, root: root_viewport});
      // this.observer_init.current = true;
    }

    if(node && has_more){
       observer.current.observe(node);
       if(exists(node.dataset.ndx)) next_restock.current = Number(node.dataset.ndx);
     }
    // let last_restock = this.last_restock.current || 0;
    // if(node)
  }
