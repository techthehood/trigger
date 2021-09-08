
#### sample loader

_VirtualScroll/Views.js_

```
  <Loader name={"views"} type={"dots"} inner={{
    onClick:() => {
      if(display_console || false) console.warn(`[Views] loader was clicked`);
      this.refresh_callback();
    }, variants:"reset-top"
  }}>
    <div className="loader_refresh icon-spinner11 d3-ico d3-bloc"></div>
  </Loader>
```