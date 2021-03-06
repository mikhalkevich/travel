(function() {
  var svg;

  //save off default references
  var d3 = window.d3, topojson = window.topojson;

  var defaultOptions = {
    scope: 'world',
    responsive: false,
    aspectRatio: 0.5625,
    setProjection: setProjection,
    projection: 'equirectangular',
    dataType: 'json',
    data: {},
    done: function() {},
    fills: {
      defaultFill: '#ABDDA4'
    },
    filters: {},
    geographyConfig: {
        dataUrl: null,
        hideAntarctica: true,
        hideHawaiiAndAlaska : false,
        borderWidth: 1,
        borderColor: '#FDFDFD',
        popupTemplate: function(geography, data) {
          return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
        },
        popupOnHover: true,
        highlightOnHover: true,
        highlightFillColor: '#FC8D59',
        highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
        highlightBorderWidth: 2
    },
    projectionConfig: {
      rotation: [97, 0]
    },
    bubblesConfig: {
        borderWidth: 2,
        borderColor: '#FFFFFF',
        popupOnHover: true,
        radius: null,
        popupTemplate: function(geography, data) {
          return '<div class="hoverinfo"><strong>' + data.name + '</strong></div>';
        },
        fillOpacity: 0.75,
        animate: true,
        highlightOnHover: true,
        highlightFillColor: '#FC8D59',
        highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
        highlightBorderWidth: 2,
        highlightFillOpacity: 0.85,
        exitDelay: 100,
        key: JSON.stringify
    },
    arcConfig: {
      strokeColor: '#DD1C77',
      strokeWidth: 1,
      arcSharpness: 1,
      animationSpeed: 600
    }
  };

  /*
    Getter for value. If not declared on datumValue, look up the chain into optionsValue
  */
  function val( datumValue, optionsValue, context ) {
    if ( typeof context === 'undefined' ) {
      context = optionsValue;
      optionsValues = undefined;
    }
    var value = typeof datumValue !== 'undefined' ? datumValue : optionsValue;

    if (typeof value === 'undefined') {
      return  null;
    }

    if ( typeof value === 'function' ) {
      var fnContext = [context];
      if ( context.geography ) {
        fnContext = [context.geography, context.data];
      }
      return value.apply(null, fnContext);
    }
    else {
      return value;
    }
  }

  function addContainer( element, height, width ) {
    this.svg = d3.select( element ).append('svg')
      .attr('width', width || element.offsetWidth)
      .attr('data-width', width || element.offsetWidth)
      .attr('class', 'datamap')
      .attr('height', height || element.offsetHeight)
      .style('overflow', 'hidden'); // IE10+ doesn't respect height/width when map is zoomed in

    if (this.options.responsive) {
      d3.select(this.options.element).style({'position': 'relative', 'padding-bottom': (this.options.aspectRatio*100) + '%'});
      d3.select(this.options.element).select('svg').style({'position': 'absolute', 'width': '100%', 'height': '100%'});
      d3.select(this.options.element).select('svg').select('g').selectAll('path').style('vector-effect', 'non-scaling-stroke');

    }

    return this.svg;
  }

  // setProjection takes the svg element and options
  function setProjection( element, options ) {
    var width = options.width || element.offsetWidth;
    var height = options.height || element.offsetHeight;
    var projection, path;
    var svg = this.svg;

    if ( options && typeof options.scope === 'undefined') {
      options.scope = 'world';
    }

    if ( options.scope === 'usa' ) {
      projection = d3.geo.albersUsa()
        .scale(width)
        .translate([width / 2, height / 2]);
    }
    else if ( options.scope === 'world' ) {
      projection = d3.geo[options.projection]()
        .scale((width + 1) / 2 / Math.PI)
        .translate([width / 2, height / (options.projection === "mercator" ? 1.45 : 1.8)]);
    }

    if ( options.projection === 'orthographic' ) {

      svg.append("defs").append("path")
        .datum({type: "Sphere"})
        .attr("id", "sphere")
        .attr("d", path);

      svg.append("use")
          .attr("class", "stroke")
          .attr("xlink:href", "#sphere");

      svg.append("use")
          .attr("class", "fill")
          .attr("xlink:href", "#sphere");
      projection.scale(250).clipAngle(90).rotate(options.projectionConfig.rotation)
    }

    path = d3.geo.path()
      .projection( projection );

    return {path: path, projection: projection};
  }

  function addStyleBlock() {
    if ( d3.select('.datamaps-style-block').empty() ) {
      d3.select('head').append('style').attr('class', 'datamaps-style-block')
      .html('.datamap path.datamaps-graticule { fill: none; stroke: #777; stroke-width: 0.5px; stroke-opacity: .5; pointer-events: none; } .datamap .labels {pointer-events: none;} .datamap path {stroke: #FFFFFF; stroke-width: 1px;} .datamaps-legend dt, .datamaps-legend dd { float: left; margin: 0 3px 0 0;} .datamaps-legend dd {width: 20px; margin-right: 6px; border-radius: 3px;} .datamaps-legend {padding-bottom: 20px; z-index: 1001; position: absolute; left: 4px; font-size: 12px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;} .datamaps-hoverover {display: none; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; } .hoverinfo {padding: 4px; border-radius: 1px; background-color: #FFF; box-shadow: 1px 1px 5px #CCC; font-size: 12px; border: 1px solid #CCC; } .hoverinfo hr {border:1px dotted #CCC; }');
    }
  }

  function drawSubunits( data ) {
    var fillData = this.options.fills,
        colorCodeData = this.options.data || {},
        geoConfig = this.options.geographyConfig;


    var subunits = this.svg.select('g.datamaps-subunits');
    if ( subunits.empty() ) {
      subunits = this.addLayer('datamaps-subunits', null, true);
    }

    var geoData = topojson.feature( data, data.objects[ this.options.scope ] ).features;
    if ( geoConfig.hideAntarctica ) {
      geoData = geoData.filter(function(feature) {
        return feature.id !== "ATA";
      });
    }

    if ( geoConfig.hideHawaiiAndAlaska ) {
      geoData = geoData.filter(function(feature) {
        return feature.id !== "HI" && feature.id !== 'AK';
      });
    }

    var geo = subunits.selectAll('path.datamaps-subunit').data( geoData );

    geo.enter()
      .append('path')
      .attr('d', this.path)
      .attr('class', function(d) {
        return 'datamaps-subunit ' + d.id;
      })
      .attr('data-info', function(d) {
        return JSON.stringify( colorCodeData[d.id]);
      })
      .style('fill', function(d) {
        //if fillKey - use that
        //otherwise check 'fill'
        //otherwise check 'defaultFill'
        var fillColor;

        var datum = colorCodeData[d.id];
        if ( datum && datum.fillKey ) {
          fillColor = fillData[ val(datum.fillKey, {data: colorCodeData[d.id], geography: d}) ];
        }

        if ( typeof fillColor === 'undefined' ) {
          fillColor = val(datum && datum.fillColor, fillData.defaultFill, {data: colorCodeData[d.id], geography: d});
        }

        return fillColor;
      })
      .style('stroke-width', geoConfig.borderWidth)
      .style('stroke', geoConfig.borderColor);
  }

  function handleGeographyConfig () {
    var hoverover;
    var svg = this.svg;
    var self = this;
    var options = this.options.geographyConfig;

    if ( options.highlightOnHover || options.popupOnHover ) {
      svg.selectAll('.datamaps-subunit')
        .on('mouseover', function(d) {
          var $this = d3.select(this);
          var datum = self.options.data[d.id] || {};
          if ( options.highlightOnHover ) {
            var previousAttributes = {
              'fill':  $this.style('fill'),
              'stroke': $this.style('stroke'),
              'stroke-width': $this.style('stroke-width'),
              'fill-opacity': $this.style('fill-opacity')
            };

            $this
              .style('fill', val(datum.highlightFillColor, options.highlightFillColor, datum))
              .style('stroke', val(datum.highlightBorderColor, options.highlightBorderColor, datum))
              .style('stroke-width', val(datum.highlightBorderWidth, options.highlightBorderWidth, datum))
              .style('fill-opacity', val(datum.highlightFillOpacity, options.highlightFillOpacity, datum))
              .attr('data-previousAttributes', JSON.stringify(previousAttributes));

            //as per discussion on https://github.com/markmarkoh/datamaps/issues/19
            if ( ! /((MSIE)|(Trident))/.test(navigator.userAgent) ) {
             moveToFront.call(this);
            }
          }

          if ( options.popupOnHover ) {
            self.updatePopup($this, d, options, svg);
          }
        })
        .on('mouseout', function() {
          var $this = d3.select(this);

          if (options.highlightOnHover) {
            //reapply previous attributes
            var previousAttributes = JSON.parse( $this.attr('data-previousAttributes') );
            for ( var attr in previousAttributes ) {
              $this.style(attr, previousAttributes[attr]);
            }
          }
          $this.on('mousemove', null);
          d3.selectAll('.datamaps-hoverover').style('display', 'none');
        });
    }

    function moveToFront() {
      this.parentNode.appendChild(this);
    }
  }

  //plugin to add a simple map legend
  function addLegend(layer, data, options) {
    data = data || {};
    if ( !this.options.fills ) {
      return;
    }

    var html = '<dl>';
    var label = '';
    if ( data.legendTitle ) {
      html = '<h2>' + data.legendTitle + '</h2>' + html;
    }
    for ( var fillKey in this.options.fills ) {

      if ( fillKey === 'defaultFill') {
        if (! data.defaultFillName ) {
          continue;
        }
        label = data.defaultFillName;
      } else {
        if (data.labels && data.labels[fillKey]) {
          label = data.labels[fillKey];
        } else {
          label= fillKey + ': ';
        }
      }
      html += '<dt>' + label + '</dt>';
      html += '<dd style="background-color:' +  this.options.fills[fillKey] + '">&nbsp;</dd>';
    }
    html += '</dl>';

    var hoverover = d3.select( this.options.element ).append('div')
      .attr('class', 'datamaps-legend')
      .html(html);
  }

    function addGraticule ( layer, options ) {
      var graticule = d3.geo.graticule();
      this.svg.insert("path", '.datamaps-subunits')
        .datum(graticule)
        .attr("class", "datamaps-graticule")
        .attr("d", this.path);
  }

  function handleArcs (layer, data, options) {
    var self = this,
        svg = this.svg;

    if ( !data || (data && !data.slice) ) {
      throw "Datamaps Error - arcs must be an array";
    }

    // For some reason arc options were put in an `options` object instead of the parent arc
    // I don't like this, so to match bubbles and other plugins I'm moving it
    // This is to keep backwards compatability
    for ( var i = 0; i < data.length; i++ ) {
      data[i] = defaults(data[i], data[i].options);
      delete data[i].options;
    }

    if ( typeof options === "undefined" ) {
      options = defaultOptions.arcConfig;
    }

    var arcs = layer.selectAll('path.datamaps-arc').data( data, JSON.stringify );

    var path = d3.geo.path()
        .projection(self.projection);

    arcs
      .enter()
        .append('svg:path')
        .attr('class', 'datamaps-arc')
        .style('stroke-linecap', 'round')
        .style('stroke', function(datum) {
          return val(datum.strokeColor, options.strokeColor, datum);
        })
        .style('fill', 'none')
        .style('stroke-width', function(datum) {
            return val(datum.strokeWidth, options.strokeWidth, datum);
        })
        .attr('d', function(datum) {
            var originXY = self.latLngToXY(val(datum.origin.latitude, datum), val(datum.origin.longitude, datum))
            var destXY = self.latLngToXY(val(datum.destination.latitude, datum), val(datum.destination.longitude, datum));
            var midXY = [ (originXY[0] + destXY[0]) / 2, (originXY[1] + destXY[1]) / 2];
            if (options.greatArc) {
                  // TODO: Move this to inside `if` clause when setting attr `d`
              var greatArc = d3.geo.greatArc()
                  .source(function(d) { return [val(d.origin.longitude, d), val(d.origin.latitude, d)]; })
                  .target(function(d) { return [val(d.destination.longitude, d), val(d.destination.latitude, d)]; });

              return path(greatArc(datum))
            }
            var sharpness = val(datum.arcSharpness, options.arcSharpness, datum);
            return "M" + originXY[0] + ',' + originXY[1] + "S" + (midXY[0] + (50 * sharpness)) + "," + (midXY[1] - (75 * sharpness)) + "," + destXY[0] + "," + destXY[1];
        })
        .transition()
          .delay(100)
          .style('fill', function(datum) {
            /*
              Thank you Jake Archibald, this is awesome.
              Source: http://jakearchibald.com/2013/animated-line-drawing-svg/
            */
            var length = this.getTotalLength();
            this.style.transition = this.style.WebkitTransition = 'none';
            this.style.strokeDasharray = length + ' ' + length;
            this.style.strokeDashoffset = length;
            this.getBoundingClientRect();
            this.style.transition = this.style.WebkitTransition = 'stroke-dashoffset ' + val(datum.animationSpeed, options.animationSpeed, datum) + 'ms ease-out';
            this.style.strokeDashoffset = '0';
            return 'none';
          })

    arcs.exit()
      .transition()
      .style('opacity', 0)
      .remove();
  }

  function handleLabels ( layer, options ) {
    var self = this;
    options = options || {};
    var labelStartCoodinates = this.projection([-67.707617, 42.722131]);
    this.svg.selectAll(".datamaps-subunit")
      .attr("data-foo", function(d) {
        var center = self.path.centroid(d);
        var xOffset = 7.5, yOffset = 5;

        if ( ["FL", "KY", "MI"].indexOf(d.id) > -1 ) xOffset = -2.5;
        if ( d.id === "NY" ) xOffset = -1;
        if ( d.id === "MI" ) yOffset = 18;
        if ( d.id === "LA" ) xOffset = 13;

        var x,y;

        x = center[0] - xOffset;
        y = center[1] + yOffset;

        var smallStateIndex = ["VT", "NH", "MA", "RI", "CT", "NJ", "DE", "MD", "DC"].indexOf(d.id);
        if ( smallStateIndex > -1) {
          var yStart = labelStartCoodinates[1];
          x = labelStartCoodinates[0];
          y = yStart + (smallStateIndex * (2+ (options.fontSize || 12)));
          layer.append("line")
            .attr("x1", x - 3)
            .attr("y1", y - 5)
            .attr("x2", center[0])
            .attr("y2", center[1])
            .style("stroke", options.labelColor || "#000")
            .style("stroke-width", options.lineWidth || 1)
        }

        layer.append("text")
          .attr("x", x)
          .attr("y", y)
          .style("font-size", (options.fontSize || 10) + 'px')
          .style("font-family", options.fontFamily || "Verdana")
          .style("fill", options.labelColor || "#000")
          .text( d.id );
        return "bar";
      });
  }


  function handleBubbles (layer, data, options ) {
    var self = this,
        fillData = this.options.fills,
        filterData = this.options.filters,
        svg = this.svg;

    if ( !data || (data && !data.slice) ) {
      throw "Datamaps Error - bubbles must be an array";
    }

    var bubbles = layer.selectAll('circle.datamaps-bubble').data( data, options.key );

    bubbles
      .enter()
        .append('svg:circle')
        .attr('class', 'datamaps-bubble')
        .attr('cx', function ( datum ) {
          var latLng;
          if ( datumHasCoords(datum) ) {
            latLng = self.latLngToXY(datum.latitude, datum.longitude);
          }
          else if ( datum.centered ) {
            latLng = self.path.centroid(svg.select('path.' + datum.centered).data()[0]);
          }
          if ( latLng ) return latLng[0];
        })
        .attr('cy', function ( datum ) {
          var latLng;
          if ( datumHasCoords(datum) ) {
            latLng = self.latLngToXY(datum.latitude, datum.longitude);
          }
          else if ( datum.centered ) {
            latLng = self.path.centroid(svg.select('path.' + datum.centered).data()[0]);
          }
          if ( latLng ) return latLng[1];
        })
        .attr('r', function(datum) {
          // if animation enabled start with radius 0, otherwise use full size.
          return options.animate ? 0 : val(datum.radius, options.radius, datum);
        })
        .attr('data-info', function(d) {
          return JSON.stringify(d);
        })
        .attr('filter', function (datum) {
          var filterKey = filterData[ val(datum.filterKey, options.filterKey, datum) ];

          if (filterKey) {
            return filterKey;
          }
        })
        .style('stroke', function ( datum ) {
          return val(datum.borderColor, options.borderColor, datum);
        })
        .style('stroke-width', function ( datum ) {
          return val(datum.borderWidth, options.borderWidth, datum);
        })
        .style('fill-opacity', function ( datum ) {
          return val(datum.fillOpacity, options.fillOpacity, datum);
        })
        .style('fill', function ( datum ) {
          var fillColor = fillData[ val(datum.fillKey, options.fillKey, datum) ];
          return fillColor || fillData.defaultFill;
        })
        .on('mouseover', function ( datum ) {
          var $this = d3.select(this);

          if (options.highlightOnHover) {
            //save all previous attributes for mouseout
            var previousAttributes = {
              'fill':  $this.style('fill'),
              'stroke': $this.style('stroke'),
              'stroke-width': $this.style('stroke-width'),
              'fill-opacity': $this.style('fill-opacity')
            };

            $this
              .style('fill', val(datum.highlightFillColor, options.highlightFillColor, datum))
              .style('stroke', val(datum.highlightBorderColor, options.highlightBorderColor, datum))
              .style('stroke-width', val(datum.highlightBorderWidth, options.highlightBorderWidth, datum))
              .style('fill-opacity', val(datum.highlightFillOpacity, options.highlightFillOpacity, datum))
              .attr('data-previousAttributes', JSON.stringify(previousAttributes));
          }

          if (options.popupOnHover) {
            self.updatePopup($this, datum, options, svg);
          }
        })
        .on('mouseout', function ( datum ) {
          var $this = d3.select(this);

          if (options.highlightOnHover) {
            //reapply previous attributes
            var previousAttributes = JSON.parse( $this.attr('data-previousAttributes') );
            for ( var attr in previousAttributes ) {
              $this.style(attr, previousAttributes[attr]);
            }
          }

          d3.selectAll('.datamaps-hoverover').style('display', 'none');
        })

    bubbles.transition()
      .duration(400)
      .attr('r', function ( datum ) {
        return val(datum.radius, options.radius, datum);
      });

    bubbles.exit()
      .transition()
        .delay(options.exitDelay)
        .attr("r", 0)
        .remove();

    function datumHasCoords (datum) {
      return typeof datum !== 'undefined' && typeof datum.latitude !== 'undefined' && typeof datum.longitude !== 'undefined';
    }
  }

  //stolen from underscore.js
  function defaults(obj) {
    Array.prototype.slice.call(arguments, 1).forEach(function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  }
  /**************************************
             Public Functions
  ***************************************/

  function Datamap( options ) {

    if ( typeof d3 === 'undefined' || typeof topojson === 'undefined' ) {
      throw new Error('Include d3.js (v3.0.3 or greater) and topojson on this page before creating a new map');
   }
    //set options for global use
    this.options = defaults(options, defaultOptions);
    this.options.geographyConfig = defaults(options.geographyConfig, defaultOptions.geographyConfig);
    this.options.projectionConfig = defaults(options.projectionConfig, defaultOptions.projectionConfig);
    this.options.bubblesConfig = defaults(options.bubblesConfig, defaultOptions.bubblesConfig);
    this.options.arcConfig = defaults(options.arcConfig, defaultOptions.arcConfig);

    //add the SVG container
    if ( d3.select( this.options.element ).select('svg').length > 0 ) {
      addContainer.call(this, this.options.element, this.options.height, this.options.width );
    }

    /* Add core plugins to this instance */
    this.addPlugin('bubbles', handleBubbles);
    this.addPlugin('legend', addLegend);
    this.addPlugin('arc', handleArcs);
    this.addPlugin('labels', handleLabels);
    this.addPlugin('graticule', addGraticule);

    //append style block with basic hoverover styles
    if ( ! this.options.disableDefaultStyles ) {
      addStyleBlock();
    }

    return this.draw();
  }

  // resize map
  Datamap.prototype.resize = function () {

    var self = this;
    var options = self.options;

    if (options.responsive) {
      var newsize = options.element.clientWidth,
          oldsize = d3.select( options.element).select('svg').attr('data-width');

      d3.select(options.element).select('svg').selectAll('g').attr('transform', 'scale(' + (newsize / oldsize) + ')');
    }
  }

  // actually draw the features(states & countries)
  Datamap.prototype.draw = function() {
    //save off in a closure
    var self = this;
    var options = self.options;

    //set projections and paths based on scope
    var pathAndProjection = options.setProjection.apply(self, [options.element, options] );

    this.path = pathAndProjection.path;
    this.projection = pathAndProjection.projection;

    //if custom URL for topojson data, retrieve it and render
    if ( options.geographyConfig.dataUrl ) {
      d3.json( options.geographyConfig.dataUrl, function(error, results) {
        if ( error ) throw new Error(error);
        self.customTopo = results;
        draw( results );
      });
    }
    else {
      draw( this[options.scope + 'Topo'] || options.geographyConfig.dataJson);
    }

    return this;

      function draw (data) {
        // if fetching remote data, draw the map first then call `updateChoropleth`
        if ( self.options.dataUrl ) {
          //allow for csv or json data types
          d3[self.options.dataType](self.options.dataUrl, function(data) {
            //in the case of csv, transform data to object
            if ( self.options.dataType === 'csv' && (data && data.slice) ) {
              var tmpData = {};
              for(var i = 0; i < data.length; i++) {
                tmpData[data[i].id] = data[i];
              }
              data = tmpData;
            }
            Datamaps.prototype.updateChoropleth.call(self, data);
          });
        }
        drawSubunits.call(self, data);
        handleGeographyConfig.call(self);

        if ( self.options.geographyConfig.popupOnHover || self.options.bubblesConfig.popupOnHover) {
          hoverover = d3.select( self.options.element ).append('div')
            .attr('class', 'datamaps-hoverover')
            .style('z-index', 10001)
            .style('position', 'absolute');
        }

        //fire off finished callback
        self.options.done(self);
      }
  };
  /**************************************
                TopoJSON
  ***************************************/
  Datamap.prototype.worldTopo = '__WORLD__';
  Datamap.prototype.abwTopo = '__ABW__';
  Datamap.prototype.afgTopo = '__AFG__';
  Datamap.prototype.agoTopo = '__AGO__';
  Datamap.prototype.aiaTopo = '__AIA__';
  Datamap.prototype.albTopo = '__ALB__';
  Datamap.prototype.aldTopo = '__ALD__';
  Datamap.prototype.andTopo = '__AND__';
  Datamap.prototype.areTopo = '__ARE__';
  Datamap.prototype.argTopo = '__ARG__';
  Datamap.prototype.armTopo = '__ARM__';
  Datamap.prototype.asmTopo = '__ASM__';
  Datamap.prototype.ataTopo = '__ATA__';
  Datamap.prototype.atcTopo = '__ATC__';
  Datamap.prototype.atfTopo = '__ATF__';
  Datamap.prototype.atgTopo = '__ATG__';
  Datamap.prototype.ausTopo = '__AUS__';
  Datamap.prototype.autTopo = '__AUT__';
  Datamap.prototype.azeTopo = '__AZE__';
  Datamap.prototype.bdiTopo = '__BDI__';
  Datamap.prototype.belTopo = '__BEL__';
  Datamap.prototype.benTopo = '__BEN__';
  Datamap.prototype.bfaTopo = '__BFA__';
  Datamap.prototype.bgdTopo = '__BGD__';
  Datamap.prototype.bgrTopo = '__BGR__';
  Datamap.prototype.bhrTopo = '__BHR__';
  Datamap.prototype.bhsTopo = '__BHS__';
  Datamap.prototype.bihTopo = {"type":"Topology","objects":{"bih":{"type":"GeometryCollection","geometries":[{"type":"Polygon","properties":{"name":"West Bosnia"},"id":"BA.BF","arcs":[[0,1,2,3,4,5]]},{"type":"Polygon","properties":{"name":"Una-Sana"},"id":"BA.BF","arcs":[[6,-5,7]]},{"type":"Polygon","properties":{"name":"Central Bosnia"},"id":"BA.BF","arcs":[[8,9,10,-1,11]]},{"type":"Polygon","properties":{"name":"West Herzegovina"},"id":"BA.BF","arcs":[[12,-3,13]]},{"type":"Polygon","properties":{"name":"Herzegovina-Neretva"},"id":"BA.BF","arcs":[[14,15,16,17,-14,-2,-11]]},{"type":"Polygon","properties":{"name":"Tuzla"},"id":"BA.BF","arcs":[[18,19,20,21,22]]},{"type":"Polygon","properties":{"name":"Zenica-Doboj"},"id":"BA.BF","arcs":[[-22,23,24,25,-9,26,27]]},{"type":"Polygon","properties":{"name":"Sarajevo"},"id":"BA.BF","arcs":[[28,29,30,31,-15,-10,-26]]},{"type":"Polygon","properties":{"name":"Bosnian Podrinje"},"id":"BA.BF","arcs":[[32,-30,33]]},{"type":"MultiPolygon","properties":{"name":"Posavina"},"id":"BA.SR","arcs":[[[34,35,36]],[[37,38]]]},{"type":"Polygon","properties":{"name":"Doboj"},"id":"BA.","arcs":[[-38,39,-36,40,-23,-28,41,42]]},{"type":"Polygon","properties":{"name":"Banja Luka"},"id":"BA.","arcs":[[-42,-27,-12,-6,-7,43]]},{"type":"Polygon","properties":{"name":"Br??ko Distrikt"},"id":"BA.","arcs":[[44,45,-19,-41,-35]]},{"type":"Polygon","properties":{"name":"Bijeljina"},"id":"BA.","arcs":[[46,-20,-46,47]]},{"type":"Polygon","properties":{"name":"Vlasenica"},"id":"BA.","arcs":[[48,49,50,-24,-21,-47]]},{"type":"MultiPolygon","properties":{"name":"Sarajevo-romanija"},"id":"BA.","arcs":[[[-31,51]],[[-34,-29,-25,-51,52]]]},{"type":"Polygon","properties":{"name":"Fo??a"},"id":"BA.","arcs":[[53,-16,-32,-52,-33,-53,-50,54]]},{"type":"Polygon","properties":{"name":"Trebinje"},"id":"BA.","arcs":[[-54,55,-17]]}]}},"arcs":[[[3927,5535],[16,-49],[44,-82],[48,-54],[17,-39],[3,-48],[31,-59],[6,-14],[24,-29],[14,-78],[27,-29],[44,-54],[44,-43],[64,-5],[72,-5],[71,-116],[14,-57]],[[4466,4774],[3,-11],[14,-54],[-1,0],[-74,29],[-48,29],[-64,-4],[-8,-19],[-16,-39],[-5,-72],[-2,-26],[0,-73],[0,-48],[27,-54],[0,-43],[0,-39],[28,0],[37,0],[71,-20],[41,-72],[78,-102],[34,-63],[30,-30],[38,-39],[0,-21]],[[4649,4003],[0,-37],[-11,-78],[-37,-48],[-34,-68],[-58,-20],[-88,-19],[-71,0],[-58,-10],[-84,-48],[-61,-39],[-92,-44],[-68,0],[-30,34],[-17,44],[-61,19],[-41,-34],[-115,-34],[-133,0],[-25,-10],[-116,-58]],[[3449,3553],[-81,77],[-125,151],[-405,431],[-285,236],[-37,61],[-21,78],[-10,61],[-19,54],[-106,101],[-83,120],[-126,134],[-72,111],[-28,43],[-40,48],[-45,36],[-112,43],[-21,43],[-12,54],[-33,56],[-26,11],[-66,-5],[-28,2],[-25,15],[-29,23],[-49,51],[-38,65],[-57,144],[-37,67],[-111,123],[-42,63],[-48,158],[-24,114],[-2,56],[7,40],[26,59],[9,31],[7,62],[-1,2]],[[1254,6572],[16,8],[28,13],[64,-9],[31,14],[17,34],[37,54],[61,5],[92,-5],[57,19],[89,10],[84,34],[126,29],[41,53],[57,112],[20,14]],[[2074,6957],[0,-1],[79,-68],[73,-74],[110,-94],[158,-110],[69,-58],[63,0],[40,-11],[29,-47],[33,-68],[48,-89],[91,-32],[48,-5],[59,-58],[102,-79],[132,-73],[121,-74],[77,-31],[41,-79],[58,-42],[59,-16],[15,-94],[3,-115],[0,-1],[37,-47],[70,-16],[238,-41],[0,1]],[[1614,9029],[9,-15],[14,-24],[-1,-29],[-15,-37],[-58,-26],[-121,-42],[-41,-68],[0,-63],[26,-58],[73,-89],[81,-26],[169,-16],[179,-11],[81,-10],[150,-11],[139,-21],[96,-21],[135,-36],[107,-69],[113,-115],[99,-142],[26,-94],[0,-147],[0,-63],[14,-42],[66,5],[22,-42],[11,-152],[0,-184],[-3,-210],[-26,-63],[-25,-73],[-22,-63],[-110,-5],[-143,-11],[-147,58],[-180,68],[-154,47],[-99,0],[-51,-5],[-11,-74],[22,-63],[35,-30]],[[1254,6572],[-7,34],[-27,28],[-54,36],[-46,12],[-29,1],[-9,-11],[1,28],[17,16],[22,14],[15,26],[-1,57],[-17,69],[-63,181],[-13,72],[-17,64],[-30,40],[-54,10],[-93,-43],[-53,7],[-53,58],[20,59],[42,56],[12,48],[21,11],[4,4],[-9,49],[-13,46],[-20,34],[-32,16],[-62,9],[-32,11],[-26,17],[-34,52],[-20,91],[-27,40],[-19,2],[-22,-13],[-21,-5],[-20,20],[-9,32],[-7,38],[-9,35],[-18,20],[-32,2],[-18,-22],[-13,-32],[-19,-23],[-22,-8],[-46,-4],[-25,-8],[-37,-6],[-23,24],[-16,38],[-20,33],[-60,43],[-15,19],[-64,109],[-29,64],[-3,61],[37,51],[53,16],[45,22],[12,64],[-24,70],[-41,66],[-35,74],[-9,92],[8,27],[12,38],[64,112],[10,65],[-31,112],[1,68],[60,158],[11,57],[-9,218],[2,28],[29,80],[27,25],[57,53],[138,23],[245,-7],[59,12],[28,-1],[31,-16],[22,-33],[-1,-32],[-10,-27],[-1,-17],[22,-16],[56,-13],[32,-25],[39,-66],[55,-143],[45,-60],[234,-237],[72,-46],[98,-44],[95,-21],[62,17],[14,52]],[[5167,6663],[23,-54],[27,-84],[50,-54],[53,-66],[9,-67],[-12,-155],[6,-191],[31,-89],[87,-84],[65,-66],[74,13],[43,-9],[0,-53],[22,-85],[16,-57],[49,-31],[44,0],[27,0],[32,-36],[12,-80],[19,-111],[40,0],[74,5],[22,-22],[6,-54],[-6,-35],[28,-40],[0,-36],[31,0],[21,0],[22,-26],[62,-107],[22,-53],[31,0],[30,7]],[[6227,4943],[22,-25],[22,-115],[3,-62],[-12,-36],[-34,-35],[-56,-23],[-81,-62],[-80,-31],[-99,-9],[-31,-40],[-13,-44],[1,-1]],[[5869,4460],[-72,-17],[-81,20],[-9,3],[-71,79],[-13,34],[-27,73],[-9,13],[-16,22],[-78,9],[-124,0],[-80,-22],[-46,-40],[-19,-17],[-99,-14],[-87,31],[-102,63],[-118,30],[-65,-13],[-53,-17],[-65,-9],[-71,44],[-53,31],[-45,11]],[[3927,5535],[25,88],[22,84],[15,105],[-26,142],[-135,178],[-63,100],[-43,120],[-41,126],[-11,163],[-11,220],[18,106],[63,15],[132,-5],[33,-32],[69,-26],[147,-8],[121,0],[92,-5],[80,-58],[66,-115],[52,-47],[43,-58],[92,-5],[161,0],[224,42],[110,-6],[5,4]],[[4822,1885],[-28,34],[-349,242],[-23,15],[-39,49],[-30,71],[-21,75],[-17,39],[-27,26],[-52,34],[-104,102],[-100,158],[-57,184],[48,308],[-41,95],[-79,55],[-248,41],[-149,87],[-57,53]],[[4649,4003],[13,4],[31,8],[56,-5],[5,0],[17,-30],[20,-33],[0,-68],[0,-34],[24,-34],[17,-29],[0,-73],[0,-59],[-7,-7],[-10,-12],[-38,0],[-54,0],[-30,0],[-19,-12],[-5,-2],[-4,-49],[0,-24],[36,-19],[2,-1],[15,1],[39,4],[38,-63],[47,-87],[58,-39],[13,-49],[27,-63],[7,0],[41,-29],[108,-19],[11,-63],[7,-50],[2,-19],[3,-71],[1,-12],[31,-77],[24,-51],[6,-12],[4,-12],[27,-80],[0,-73],[-1,0],[-7,0],[-145,9],[-72,12],[-53,8],[-58,24],[-61,5],[-28,-29],[-6,-63],[7,-23],[27,-84],[6,-2],[58,-13],[78,-92],[5,-14],[29,-93],[-27,-145],[-62,-157],[-80,-118]],[[5869,4460],[21,-34],[25,-105],[3,-11],[2,-8],[20,-93],[18,-50],[44,-44],[82,-19],[14,-3],[17,4],[60,13],[53,-8],[6,0],[18,-19],[65,-65],[1,-1],[37,-102],[2,-55],[1,-25],[28,-22],[71,-27],[56,-41],[9,-7],[9,-3],[25,-6],[30,-4],[7,-1],[13,49],[21,53],[49,-17],[1,0],[59,-27],[71,0],[24,-6],[1,0]],[[6832,3776],[-18,-19],[-3,-3],[-10,-94],[14,-142],[22,-120],[26,-121],[-11,-52],[-88,0]],[[6764,3225],[-253,25],[-224,-10],[-183,0],[-176,10],[-12,-52],[-6,-26],[62,-105],[11,-121],[8,-236],[7,-331],[-29,-42],[-41,-52],[-58,-32],[-41,-63],[-7,-57],[7,-42],[50,-5],[9,-1],[13,-5],[53,-21],[40,-42],[-4,-79],[-3,-60],[-26,-105],[-18,-22],[-26,-31],[-26,-57],[-3,-134],[0,-34],[1,-7],[25,-156],[40,-136],[45,-85],[2,-5],[2,-1],[75,-56],[162,-153],[58,-60],[73,-76],[23,-50],[10,-24],[1,0],[135,-152],[125,-126],[73,-78],[70,-22],[3,-80],[-12,-172]],[[6799,56],[-52,80],[-28,23],[-69,-5],[-140,50],[-84,49],[-448,318],[-139,94],[-60,53],[-110,132],[-62,50],[-90,27],[-28,19],[-80,132],[-6,42],[3,89],[-7,35],[-30,43],[-23,-1],[-21,-19],[-20,-12],[-54,10],[-108,45],[-56,12],[-57,-14],[-34,-39],[-33,-52],[-1,1],[-247,160],[45,-2],[69,-33],[44,-13],[-39,40],[-57,35],[138,30],[72,56],[-8,102],[-1,0],[0,1],[-79,194],[-77,97]],[[7768,8386],[37,-152],[14,-147],[19,-63],[73,-5]],[[7911,8019],[3,-63],[-18,-84],[-69,-47],[-74,-48],[-29,-42],[-4,-84],[26,-73],[99,-100],[139,-168],[40,-37],[52,0],[58,32],[74,131],[47,116],[33,57],[92,21],[92,-21],[18,-57],[3,-184]],[[8493,7368],[1,-32],[-8,-251],[-22,-53],[-66,-58],[-44,-18],[-73,-63],[-66,-42],[-103,-5],[-113,-32],[-33,-89],[-48,-68],[-77,-47],[-58,-11],[-23,-63],[19,-152],[40,-95],[37,-99],[26,-116],[-15,-126],[-55,-110],[-6,-6]],[[7806,5832],[-60,89],[-142,0],[-177,-9],[-53,22],[-24,76],[-72,0],[-55,13],[-13,18],[0,106],[-37,129],[-22,129],[-49,44],[-87,45],[-62,13],[-65,75],[-31,76],[0,66],[-19,71],[-37,27],[-127,-4],[-40,31],[-25,75],[0,76],[0,75],[-3,89],[-22,62],[0,53],[3,71],[0,47]],[[6587,7397],[1,0],[117,-5],[132,31],[15,84],[-15,95],[-70,83],[-113,37],[-107,37],[-128,47],[-106,47],[-114,48],[-106,57],[-40,48],[0,105],[18,63],[103,15],[109,11],[202,0],[103,26],[62,100],[55,163],[37,94],[66,47],[62,27],[161,-8],[88,-27],[0,-84],[0,-41],[0,-1],[29,-36],[70,-6],[62,16],[92,42],[143,-10],[154,-42],[99,-74]],[[7806,5832],[-34,-36],[-33,-68]],[[7739,5728],[-85,-79],[-113,-121],[-92,-57],[-94,-5]],[[7355,5466],[-15,29],[-62,13],[-43,31],[-25,49],[-40,62],[-41,36],[-52,9],[-44,0],[-52,0],[-9,-14],[-28,-35],[-35,-67],[-43,-35],[-50,0],[-65,0],[-30,-27],[-4,-53],[4,-120],[-31,-40],[-72,-40],[-102,-4],[-87,4],[-77,-26],[-19,-71],[0,-98],[-22,-35],[-37,-18],[-28,0],[-31,-31],[7,-36],[5,-6]],[[5167,6663],[83,65],[128,73],[106,63],[92,74],[62,73],[11,89],[0,89],[-14,100],[-63,63],[-88,89],[-54,106],[0,83],[44,105],[91,192]],[[5565,7927],[88,26],[132,-10],[106,-16],[88,-84],[85,-147],[87,-194],[1,0],[51,-89],[70,-11],[117,-5],[197,0]],[[7355,5466],[-27,-1],[-18,-76],[-77,-68],[-77,-63],[-26,-52],[-4,-90],[15,-131],[7,-110],[0,-116],[-22,-47],[-40,-37],[-77,-10],[-69,16],[-107,10],[-33,-21],[8,-73],[7,-84],[70,-126],[33,-63],[69,-6],[110,-5],[81,-42],[106,-47],[127,-98]],[[7411,4126],[-7,-9],[-31,-35],[-21,-53],[-8,-45],[1,-31]],[[7345,3953],[-87,40],[-84,42],[-62,63],[-73,52],[-52,0],[-77,0],[-29,-89],[-11,-152],[-18,-113]],[[6852,3796],[-20,-20]],[[8285,4339],[58,-63],[59,0],[84,-26],[44,-57],[30,-106],[-15,-52],[-81,-16],[-62,-68],[-84,-68],[-114,-53],[-84,-42],[-103,-15],[-135,-21],[-81,-22],[-172,27],[-114,58],[-165,136],[-5,2]],[[7411,4126],[9,-7],[62,-10],[95,-6],[48,47],[44,90],[26,120],[51,69],[114,15],[241,-5],[121,-21],[63,-79]],[[8009,8501],[-5,-13],[-13,-47],[-75,-67],[-63,0],[0,39],[8,74],[-12,50],[-27,23]],[[7822,8560],[-67,5],[-51,12],[-8,78],[-67,68],[-110,62],[-110,0],[-103,40],[-102,78],[-79,96],[-35,40],[-8,118],[4,44]],[[7086,9201],[23,-16],[67,-25],[62,-2],[-5,52],[-12,44],[1,25],[0,8],[37,16],[21,-2],[41,-10],[21,-1],[17,7],[36,22],[17,3],[19,-9],[12,-16],[17,-48],[15,-30],[18,-24],[20,-10],[25,13],[7,18],[6,22],[7,22],[13,14],[18,2],[15,-10],[13,-16],[95,-199],[31,-38],[30,-13],[72,-7],[17,-7],[11,-10],[7,-15],[7,-23],[2,-7],[0,-20],[1,-11],[6,-10],[13,-18],[4,-13],[-8,-36],[-56,-43],[-18,-36],[27,-105],[89,-96],[62,-42]],[[7009,9267],[-21,-48],[-16,-84],[-63,-34],[-87,-34],[-71,-28],[-19,-51],[-20,-45],[-12,-34],[-55,0],[-82,0],[-55,11],[-64,113],[-55,62],[-47,40],[-47,5],[-32,51],[-39,101],[-4,20],[0,2]],[[6220,9314],[25,-1],[55,12],[45,28],[17,39],[2,46],[6,46],[28,35],[63,14],[62,-25],[116,-85],[38,-17],[181,-16],[49,-22],[44,-38],[58,-63]],[[7009,9267],[37,-40],[40,-26]],[[7822,8560],[-54,-174]],[[5565,7927],[-183,-51],[-95,50],[-61,124],[-84,230],[-2,217],[28,125],[76,74],[1,182],[-53,165],[-7,177],[66,142]],[[5251,9362],[82,-106],[46,-43],[52,-21],[25,3],[76,32],[70,13],[22,13],[42,40],[156,190],[38,20],[40,0],[41,-22],[142,-130],[56,-27],[50,-10],[31,0]],[[1614,9029],[28,104],[52,99],[12,30],[5,43],[-5,24],[0,21],[19,34],[23,17],[68,21],[27,21],[35,55],[84,189],[121,84],[148,-6],[511,-154],[65,9],[32,29],[4,27],[-2,31],[15,44],[25,26],[29,12],[25,18],[15,41],[20,13],[27,31],[21,30],[7,17],[71,60],[21,-21],[21,-77],[3,-29],[-1,-32],[14,-20],[53,6],[-6,25],[-11,25],[38,-14],[31,-39],[27,-19],[25,47],[9,-28],[4,-22],[-2,-22],[-11,-31],[15,13],[41,27],[15,13],[50,-110],[110,-84],[67,-32],[160,-75],[27,16],[122,9],[11,17],[49,109],[100,-67],[48,-20],[84,-56],[24,-21],[35,-20],[47,5],[86,28],[5,12],[7,23],[11,15],[20,-13],[15,-25],[3,-21],[-8,-20],[-18,-23],[32,-11],[31,5],[61,33],[-24,-76],[-13,-24],[19,7],[129,17],[56,-6],[28,4],[53,34],[94,101],[56,30],[85,-5],[76,-44],[69,-69],[62,-82]],[[8009,8501],[42,-28],[80,-27],[218,6]],[[8349,8452],[1,-71],[-39,-29],[-58,-27],[-39,-63],[-33,-100],[-59,-45],[-127,-11],[-39,-28],[-45,-59]],[[8874,7261],[-29,61],[-55,74],[-81,58],[-41,12],[-63,-23],[-71,-51],[-41,-24]],[[8349,8452],[77,2],[28,8],[82,26],[53,8],[41,15],[230,170],[32,8],[16,-22],[10,-30],[13,-18],[25,0],[46,20],[25,5],[114,-25],[23,4],[21,11],[23,0],[51,-51],[26,-9],[26,3],[7,4],[0,4],[10,-12],[15,-17],[15,-15],[11,-21],[7,-30],[2,-38],[-9,-10],[-13,-3],[-11,-17],[-90,-443],[-27,-68],[-24,-38],[-52,-44],[-27,-30],[-20,-34],[-36,-110],[-121,-210],[-12,-12],[-27,-17],[-13,-16],[-5,-25],[2,-59],[-5,-26],[-14,-29]],[[8874,7261],[-17,-25],[-20,-17],[-91,-31],[-6,-58],[41,-163],[-5,-100],[-31,-54],[-35,-46],[-22,-77],[5,-70],[19,-73],[57,-126],[47,-58],[51,-24],[110,-25],[53,-27],[23,-8],[36,-2],[83,21],[29,-6],[43,-37],[45,-67],[31,-79],[6,-74],[16,-47],[48,-52],[112,-86],[27,-28],[18,-10],[15,4],[29,30],[16,1],[21,-29],[6,-66],[16,-23],[40,-38],[46,-70],[15,-23],[83,-50],[42,-53],[24,-20],[9,10],[16,22],[23,9],[32,-30],[19,-69],[-22,-60],[-43,-50],[-106,-82],[-60,-22],[-63,-6],[-146,15],[-136,-10],[-38,-12],[-37,-2],[-33,22],[-67,64],[-65,47],[-33,13],[-38,-2],[-53,-18],[-22,-20],[-14,-35],[1,-26],[12,-47],[-6,-26],[-29,-29],[30,-20]],[[9031,5111],[-41,-113]],[[8990,4998],[-126,150],[-124,134],[-312,178],[-249,164],[-218,59],[-222,45]],[[7345,3953],[-78,-72],[-99,-12],[-117,0],[-99,-95],[-100,22]],[[8990,4998],[-22,-59],[21,-193],[-10,-134],[52,-149],[-52,-89],[-115,15],[-83,59],[-187,45],[-176,-60],[-133,-94]],[[7553,2473],[-81,56],[-114,74],[-208,194],[-145,-30],[-104,74],[-83,-44],[-73,89],[41,164],[-22,175]],[[9031,5111],[88,-70],[78,-104],[137,-230],[262,-294],[52,-120],[61,-204],[4,-97],[-65,-67],[-11,-44],[-5,-53],[3,-51],[13,-39],[18,-18],[7,-17],[-5,-15],[-20,-13],[-97,40],[-31,-2],[-32,-81],[-22,-31],[-20,33],[-22,62],[-36,70],[-44,58],[-43,27],[-27,-9],[-60,-49],[-30,-17],[-30,-2],[-65,11],[-28,-8],[-36,-61],[-24,-82],[-30,-62],[-57,0],[-122,20],[-64,-8],[-69,-85],[-50,-21],[-55,-2],[-43,16],[-33,44],[-28,54],[-36,37],[-58,-6],[-38,-29],[-61,-71],[-47,-25],[-25,-18],[-15,-30],[2,-31],[24,-19],[40,-11],[18,-13],[34,-55],[-1,-24],[-11,-30],[0,-19],[56,15],[18,-14],[89,-122],[76,-221],[77,-154],[-18,-16],[-68,-4],[-29,-17],[-6,-8],[-14,-20],[-16,-32],[-20,-31],[-27,-25],[-7,18],[-2,4],[-52,70],[-23,42],[-6,30],[2,27],[-2,25],[-18,26],[-69,51],[-62,18],[-153,-15],[-47,-23],[9,-15],[15,-34],[8,-14],[-68,-23],[-327,-251],[-39,-60]],[[7553,2473],[62,-32],[-110,-163],[-42,-93],[-20,-111],[-2,-7],[2,-96],[46,-279],[-105,15],[-152,-2],[-143,-34],[-78,-78],[-49,-144],[1,-63],[26,-74],[61,-129],[14,-70],[-19,-36],[-32,-26],[-25,-41],[2,-64],[24,-88],[35,-88],[89,-153],[52,-57],[44,-60],[27,-101],[-2,-107],[-17,-45],[-11,-30],[-54,-56],[-27,-17],[-52,-32],[18,-36],[6,-33],[-10,-23],[-26,-4],[-29,20],[-30,3],[-29,-13],[-26,-26],[-42,16],[-92,11],[-37,26],[-2,3]]],"transform":{"scale":[0.00039032011931192475,0.00027255842454245295],"translate":[15.716073852000108,42.559212138000106]}};
  Datamap.prototype.bjnTopo = '__BJN__';
  Datamap.prototype.blmTopo = '__BLM__';
  Datamap.prototype.blrTopo = '__BLR__';
  Datamap.prototype.blzTopo = '__BLZ__';
  Datamap.prototype.bmuTopo = '__BMU__';
  Datamap.prototype.bolTopo = '__BOL__';
  Datamap.prototype.braTopo = '__BRA__';
  Datamap.prototype.brbTopo = '__BRB__';
  Datamap.prototype.brnTopo = '__BRN__';
  Datamap.prototype.btnTopo = '__BTN__';
  Datamap.prototype.norTopo = '__NOR__';
  Datamap.prototype.bwaTopo = '__BWA__';
  Datamap.prototype.cafTopo = '__CAF__';
  Datamap.prototype.canTopo = '__CAN__';
  Datamap.prototype.cheTopo = '__CHE__';
  Datamap.prototype.chlTopo = '__CHL__';
  Datamap.prototype.chnTopo = '__CHN__';
  Datamap.prototype.civTopo = '__CIV__';
  Datamap.prototype.clpTopo = '__CLP__';
  Datamap.prototype.cmrTopo = '__CMR__';
  Datamap.prototype.codTopo = '__COD__';
  Datamap.prototype.cogTopo = '__COG__';
  Datamap.prototype.cokTopo = '__COK__';
  Datamap.prototype.colTopo = '__COL__';
  Datamap.prototype.comTopo = '__COM__';
  Datamap.prototype.cpvTopo = '__CPV__';
  Datamap.prototype.criTopo = '__CRI__';
  Datamap.prototype.csiTopo = '__CSI__';
  Datamap.prototype.cubTopo = '__CUB__';
  Datamap.prototype.cuwTopo = '__CUW__';
  Datamap.prototype.cymTopo = '__CYM__';
  Datamap.prototype.cynTopo = '__CYN__';
  Datamap.prototype.cypTopo = '__CYP__';
  Datamap.prototype.czeTopo = '__CZE__';
  Datamap.prototype.deuTopo = '__DEU__';
  Datamap.prototype.djiTopo = '__DJI__';
  Datamap.prototype.dmaTopo = '__DMA__';
  Datamap.prototype.dnkTopo = '__DNK__';
  Datamap.prototype.domTopo = '__DOM__';
  Datamap.prototype.dzaTopo = '__DZA__';
  Datamap.prototype.ecuTopo = '__ECU__';
  Datamap.prototype.egyTopo = '__EGY__';
  Datamap.prototype.eriTopo = '__ERI__';
  Datamap.prototype.esbTopo = '__ESB__';
  Datamap.prototype.espTopo = '__ESP__';
  Datamap.prototype.estTopo = '__EST__';
  Datamap.prototype.ethTopo = '__ETH__';
  Datamap.prototype.finTopo = '__FIN__';
  Datamap.prototype.fjiTopo = '__FJI__';
  Datamap.prototype.flkTopo = '__FLK__';
  Datamap.prototype.fraTopo = '__FRA__';
  Datamap.prototype.froTopo = '__FRO__';
  Datamap.prototype.fsmTopo = '__FSM__';
  Datamap.prototype.gabTopo = '__GAB__';
  Datamap.prototype.psxTopo = '__PSX__';
  Datamap.prototype.gbrTopo = '__GBR__';
  Datamap.prototype.geoTopo = '__GEO__';
  Datamap.prototype.ggyTopo = '__GGY__';
  Datamap.prototype.ghaTopo = '__GHA__';
  Datamap.prototype.gibTopo = '__GIB__';
  Datamap.prototype.ginTopo = '__GIN__';
  Datamap.prototype.gmbTopo = '__GMB__';
  Datamap.prototype.gnbTopo = '__GNB__';
  Datamap.prototype.gnqTopo = '__GNQ__';
  Datamap.prototype.grcTopo = '__GRC__';
  Datamap.prototype.grdTopo = '__GRD__';
  Datamap.prototype.grlTopo = '__GRL__';
  Datamap.prototype.gtmTopo = '__GTM__';
  Datamap.prototype.gumTopo = '__GUM__';
  Datamap.prototype.guyTopo = '__GUY__';
  Datamap.prototype.hkgTopo = '__HKG__';
  Datamap.prototype.hmdTopo = '__HMD__';
  Datamap.prototype.hndTopo = '__HND__';
  Datamap.prototype.hrvTopo = '__HRV__';
  Datamap.prototype.htiTopo = '__HTI__';
  Datamap.prototype.hunTopo = '__HUN__';
  Datamap.prototype.idnTopo = '__IDN__';
  Datamap.prototype.imnTopo = '__IMN__';
  Datamap.prototype.indTopo = '__IND__';
  Datamap.prototype.ioaTopo = '__IOA__';
  Datamap.prototype.iotTopo = '__IOT__';
  Datamap.prototype.irlTopo = '__IRL__';
  Datamap.prototype.irnTopo = '__IRN__';
  Datamap.prototype.irqTopo = '__IRQ__';
  Datamap.prototype.islTopo = '__ISL__';
  Datamap.prototype.isrTopo = '__ISR__';
  Datamap.prototype.itaTopo = '__ITA__';
  Datamap.prototype.jamTopo = '__JAM__';
  Datamap.prototype.jeyTopo = '__JEY__';
  Datamap.prototype.jorTopo = '__JOR__';
  Datamap.prototype.jpnTopo = '__JPN__';
  Datamap.prototype.kabTopo = '__KAB__';
  Datamap.prototype.kasTopo = '__KAS__';
  Datamap.prototype.kazTopo = '__KAZ__';
  Datamap.prototype.kenTopo = '__KEN__';
  Datamap.prototype.kgzTopo = '__KGZ__';
  Datamap.prototype.khmTopo = '__KHM__';
  Datamap.prototype.kirTopo = '__KIR__';
  Datamap.prototype.knaTopo = '__KNA__';
  Datamap.prototype.korTopo = '__KOR__';
  Datamap.prototype.kosTopo = '__KOS__';
  Datamap.prototype.kwtTopo = '__KWT__';
  Datamap.prototype.laoTopo = '__LAO__';
  Datamap.prototype.lbnTopo = '__LBN__';
  Datamap.prototype.lbrTopo = '__LBR__';
  Datamap.prototype.lbyTopo = '__LBY__';
  Datamap.prototype.lcaTopo = '__LCA__';
  Datamap.prototype.lieTopo = '__LIE__';
  Datamap.prototype.lkaTopo = '__LKA__';
  Datamap.prototype.lsoTopo = '__LSO__';
  Datamap.prototype.ltuTopo = '__LTU__';
  Datamap.prototype.luxTopo = '__LUX__';
  Datamap.prototype.lvaTopo = '__LVA__';
  Datamap.prototype.macTopo = '__MAC__';
  Datamap.prototype.mafTopo = '__MAF__';
  Datamap.prototype.marTopo = '__MAR__';
  Datamap.prototype.mcoTopo = '__MCO__';
  Datamap.prototype.mdaTopo = '__MDA__';
  Datamap.prototype.mdgTopo = '__MDG__';
  Datamap.prototype.mdvTopo = '__MDV__';
  Datamap.prototype.mexTopo = '__MEX__';
  Datamap.prototype.mhlTopo = '__MHL__';
  Datamap.prototype.mkdTopo = '__MKD__';
  Datamap.prototype.mliTopo = '__MLI__';
  Datamap.prototype.mltTopo = '__MLT__';
  Datamap.prototype.mmrTopo = '__MMR__';
  Datamap.prototype.mneTopo = '__MNE__';
  Datamap.prototype.mngTopo = '__MNG__';
  Datamap.prototype.mnpTopo = '__MNP__';
  Datamap.prototype.mozTopo = '__MOZ__';
  Datamap.prototype.mrtTopo = '__MRT__';
  Datamap.prototype.msrTopo = '__MSR__';
  Datamap.prototype.musTopo = '__MUS__';
  Datamap.prototype.mwiTopo = '__MWI__';
  Datamap.prototype.mysTopo = '__MYS__';
  Datamap.prototype.namTopo = '__NAM__';
  Datamap.prototype.nclTopo = '__NCL__';
  Datamap.prototype.nerTopo = '__NER__';
  Datamap.prototype.nfkTopo = '__NFK__';
  Datamap.prototype.ngaTopo = '__NGA__';
  Datamap.prototype.nicTopo = '__NIC__';
  Datamap.prototype.niuTopo = '__NIU__';
  Datamap.prototype.nldTopo = '__NLD__';
  Datamap.prototype.nplTopo = '__NPL__';
  Datamap.prototype.nruTopo = '__NRU__';
  Datamap.prototype.nulTopo = '__NUL__';
  Datamap.prototype.nzlTopo = '__NZL__';
  Datamap.prototype.omnTopo = '__OMN__';
  Datamap.prototype.pakTopo = '__PAK__';
  Datamap.prototype.panTopo = '__PAN__';
  Datamap.prototype.pcnTopo = '__PCN__';
  Datamap.prototype.perTopo = '__PER__';
  Datamap.prototype.pgaTopo = '__PGA__';
  Datamap.prototype.phlTopo = '__PHL__';
  Datamap.prototype.plwTopo = '__PLW__';
  Datamap.prototype.pngTopo = '__PNG__';
  Datamap.prototype.polTopo = '__POL__';
  Datamap.prototype.priTopo = '__PRI__';
  Datamap.prototype.prkTopo = '__PRK__';
  Datamap.prototype.prtTopo = '__PRT__';
  Datamap.prototype.pryTopo = '__PRY__';
  Datamap.prototype.pyfTopo = '__PYF__';
  Datamap.prototype.qatTopo = '__QAT__';
  Datamap.prototype.rouTopo = '__ROU__';
  Datamap.prototype.rusTopo = '__RUS__';
  Datamap.prototype.rwaTopo = '__RWA__';
  Datamap.prototype.sahTopo = '__SAH__';
  Datamap.prototype.sauTopo = '__SAU__';
  Datamap.prototype.scrTopo = '__SCR__';
  Datamap.prototype.sdnTopo = '__SDN__';
  Datamap.prototype.sdsTopo = '__SDS__';
  Datamap.prototype.senTopo = '__SEN__';
  Datamap.prototype.serTopo = '__SER__';
  Datamap.prototype.sgpTopo = '__SGP__';
  Datamap.prototype.sgsTopo = '__SGS__';
  Datamap.prototype.shnTopo = '__SHN__';
  Datamap.prototype.slbTopo = '__SLB__';
  Datamap.prototype.sleTopo = '__SLE__';
  Datamap.prototype.slvTopo = '__SLV__';
  Datamap.prototype.smrTopo = '__SMR__';
  Datamap.prototype.solTopo = '__SOL__';
  Datamap.prototype.somTopo = '__SOM__';
  Datamap.prototype.spmTopo = '__SPM__';
  Datamap.prototype.srbTopo = '__SRB__';
  Datamap.prototype.stpTopo = '__STP__';
  Datamap.prototype.surTopo = '__SUR__';
  Datamap.prototype.svkTopo = '__SVK__';
  Datamap.prototype.svnTopo = '__SVN__';
  Datamap.prototype.sweTopo = '__SWE__';
  Datamap.prototype.swzTopo = '__SWZ__';
  Datamap.prototype.sxmTopo = '__SXM__';
  Datamap.prototype.sycTopo = '__SYC__';
  Datamap.prototype.syrTopo = '__SYR__';
  Datamap.prototype.tcaTopo = '__TCA__';
  Datamap.prototype.tcdTopo = '__TCD__';
  Datamap.prototype.tgoTopo = '__TGO__';
  Datamap.prototype.thaTopo = '__THA__';
  Datamap.prototype.tjkTopo = '__TJK__';
  Datamap.prototype.tkmTopo = '__TKM__';
  Datamap.prototype.tlsTopo = '__TLS__';
  Datamap.prototype.tonTopo = '__TON__';
  Datamap.prototype.ttoTopo = '__TTO__';
  Datamap.prototype.tunTopo = '__TUN__';
  Datamap.prototype.turTopo = '__TUR__';
  Datamap.prototype.tuvTopo = '__TUV__';
  Datamap.prototype.twnTopo = '__TWN__';
  Datamap.prototype.tzaTopo = '__TZA__';
  Datamap.prototype.ugaTopo = '__UGA__';
  Datamap.prototype.ukrTopo = '__UKR__';
  Datamap.prototype.umiTopo = '__UMI__';
  Datamap.prototype.uryTopo = '__URY__';
  Datamap.prototype.usaTopo = '__USA__';
  Datamap.prototype.usgTopo = '__USG__';
  Datamap.prototype.uzbTopo = '__UZB__';
  Datamap.prototype.vatTopo = '__VAT__';
  Datamap.prototype.vctTopo = '__VCT__';
  Datamap.prototype.venTopo = '__VEN__';
  Datamap.prototype.vgbTopo = '__VGB__';
  Datamap.prototype.virTopo = '__VIR__';
  Datamap.prototype.vnmTopo = '__VNM__';
  Datamap.prototype.vutTopo = '__VUT__';
  Datamap.prototype.wlfTopo = '__WLF__';
  Datamap.prototype.wsbTopo = '__WSB__';
  Datamap.prototype.wsmTopo = '__WSM__';
  Datamap.prototype.yemTopo = '__YEM__';
  Datamap.prototype.zafTopo = '__ZAF__';
  Datamap.prototype.zmbTopo = '__ZMB__';
  Datamap.prototype.zweTopo = '__ZWE__';

  /**************************************
                Utilities
  ***************************************/

  //convert lat/lng coords to X / Y coords
  Datamap.prototype.latLngToXY = function(lat, lng) {
     return this.projection([lng, lat]);
  };

  //add <g> layer to root SVG
  Datamap.prototype.addLayer = function( className, id, first ) {
    var layer;
    if ( first ) {
      layer = this.svg.insert('g', ':first-child')
    }
    else {
      layer = this.svg.append('g')
    }
    return layer.attr('id', id || '')
      .attr('class', className || '');
  };

  Datamap.prototype.updateChoropleth = function(data) {
    var svg = this.svg;
    for ( var subunit in data ) {
      if ( data.hasOwnProperty(subunit) ) {
        var color;
        var subunitData = data[subunit]
        if ( ! subunit ) {
          continue;
        }
        else if ( typeof subunitData === "string" ) {
          color = subunitData;
        }
        else if ( typeof subunitData.color === "string" ) {
          color = subunitData.color;
        }
        else {
          color = this.options.fills[ subunitData.fillKey ];
        }
        //if it's an object, overriding the previous data
        if ( subunitData === Object(subunitData) ) {
          this.options.data[subunit] = defaults(subunitData, this.options.data[subunit] || {});
          var geo = this.svg.select('.' + subunit).attr('data-info', JSON.stringify(this.options.data[subunit]));
        }
        svg
          .selectAll('.' + subunit)
          .transition()
            .style('fill', color);
      }
    }
  };

  Datamap.prototype.updatePopup = function (element, d, options) {
    var self = this;
    element.on('mousemove', null);
    element.on('mousemove', function() {
      var position = d3.mouse(self.options.element);
      d3.select(self.svg[0][0].parentNode).select('.datamaps-hoverover')
        .style('top', ( (position[1] + 30)) + "px")
        .html(function() {
          var data = JSON.parse(element.attr('data-info'));
          try {
            return options.popupTemplate(d, data);
          } catch (e) {
            return "";
          }
        })
        .style('left', ( position[0]) + "px");
    });

    d3.select(self.svg[0][0].parentNode).select('.datamaps-hoverover').style('display', 'block');
  };

  Datamap.prototype.addPlugin = function( name, pluginFn ) {
    var self = this;
    if ( typeof Datamap.prototype[name] === "undefined" ) {
      Datamap.prototype[name] = function(data, options, callback, createNewLayer) {
        var layer;
        if ( typeof createNewLayer === "undefined" ) {
          createNewLayer = false;
        }

        if ( typeof options === 'function' ) {
          callback = options;
          options = undefined;
        }

        options = defaults(options || {}, self.options[name + 'Config']);

        //add a single layer, reuse the old layer
        if ( !createNewLayer && this.options[name + 'Layer'] ) {
          layer = this.options[name + 'Layer'];
          options = options || this.options[name + 'Options'];
        }
        else {
          layer = this.addLayer(name);
          this.options[name + 'Layer'] = layer;
          this.options[name + 'Options'] = options;
        }
        pluginFn.apply(this, [layer, data, options]);
        if ( callback ) {
          callback(layer);
        }
      };
    }
  };

  // expose library
  if (typeof exports === 'object') {
    d3 = require('d3');
    topojson = require('topojson');
    module.exports = Datamap;
  }
  else if ( typeof define === "function" && define.amd ) {
    define( "datamaps", ["require", "d3", "topojson"], function(require) {
      d3 = require('d3');
      topojson = require('topojson');

      return Datamap;
    });
  }
  else {
    window.Datamap = window.Datamaps = Datamap;
  }

  if ( window.jQuery ) {
    window.jQuery.fn.datamaps = function(options, callback) {
      options = options || {};
      options.element = this[0];
      var datamap = new Datamap(options);
      if ( typeof callback === "function" ) {
        callback(datamap, options);
      }
      return this;
    };
  }
})();
