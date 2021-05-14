var RadarChart = {
  defaultConfig: {
    containerClass: 'radar-chart',
    w: 600,
    h: 600,
    factor: 0.95,
    factorLegend: 1,
    levels: 3,
    maxValue: 0,
    radians: 2 * Math.PI,
    color: d3.scale.category10(),
    axisLine: true,
    axisText: true,
    circles: true,
    radius: 5,
    axisJoin: function(d, i) {
      return d.className || i;
    },
    transitionDuration: 300
  },
  chart: function() {
    // default config
    var cfg = Object.create(RadarChart.defaultConfig);

    function radar(selection) {
      selection.each(function(data) {
        var container = d3.select(this);

        // allow simple notation
        data = data.map(function(datum) {
          if(datum instanceof Array) {
            datum = {axes: datum};
          }
          return datum;
        });

        var maxValue = Math.max(cfg.maxValue, d3.max(data, function(d) { 
          return d3.max(d.axes, function(o){ return o.value; });
        }));

        // var allAxis = data[0].axes.map(function(i, j){ return i.axis; });
        var allAxis = ["economics", "governance", "platform", "porosity", "size"];
        var total = allAxis.length;
        var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);

        container.classed(cfg.containerClass, 1);

        function getPosition(i, range, factor, func){
          factor = typeof factor !== 'undefined' ? factor : 1;
          if (func == Math.sin) {
              return range * (1 + factor * func(i * cfg.radians / total));
          }
          else {
            return range * (1 - factor * func(i * cfg.radians / total));
          }
        }
        function getHorizontalPosition(i, range, factor){
          return getPosition(i, range, factor, Math.sin);
        }
        function getVerticalPosition(i, range, factor){
          return getPosition(i, range, factor, Math.cos);
        }

        // radial scale
        var radialScale = d3.scale.linear()
            .domain([0,cfg.radius])
            .range([0,(cfg.w/4 * cfg.factor * 6/5)]);
        const radialTicks = [1,2,3,4,5];

        // radial gridlines
        var radialGrid = container.append("g")
            .attr("class", "grid-radial")
            .selectAll("circle")
            .data(radialTicks)
            .enter()
            .append("circle")
                .attr("cx", cfg.w/2)
                .attr("cy", cfg.h/2)
                .attr("r", (t) => radialScale(t))
                .attr("fill", "none")
                .attr("stroke", "#ccc")
                .attr("stroke-width", 1);

        // levels && axises
        var levelFactors = d3.range(0, cfg.levels).map(function(level) {
          return radius * ((level + 1) / cfg.levels);
        });

        var levelGroups = container.selectAll('g.level-group').data(levelFactors);

        levelGroups.enter().append('g');
        levelGroups.exit().remove();

        levelGroups.attr('class', function(d, i) {
          return 'level-group level-group-' + i;
        });

        var levelLine = levelGroups.selectAll('.level').data(function(levelFactor) {
          return d3.range(0, total).map(function() { return levelFactor; });
        });

        levelLine.enter().append('line');
        levelLine.exit().remove();

        levelLine
          .attr('class', 'level')
          .attr('x1', function(levelFactor, i){ return getHorizontalPosition(i, levelFactor); })
          .attr('y1', function(levelFactor, i){ return getVerticalPosition(i, levelFactor); })
          .attr('x2', function(levelFactor, i){ return getHorizontalPosition(i+1, levelFactor); })
          .attr('y2', function(levelFactor, i){ return getVerticalPosition(i+1, levelFactor); })
          .attr('transform', function(levelFactor) {
            return 'translate(' + (cfg.w/2-levelFactor) + ', ' + (cfg.h/2-levelFactor) + ')';
          });

        if(cfg.axisLine || cfg.axisText) {
          var axis = container.selectAll('.axis').data(allAxis);

          var newAxis = axis.enter().append('g');
          if(cfg.axisLine) {
            newAxis.append('line');
          }
          if(cfg.axisText) {
            newAxis.append('text');
          }

          axis.exit().remove();

          axis.attr('class', 'axis');

          if(cfg.axisLine) {
            axis.select('line')
            //   .attr('x1', cfg.w/2)
            //   .attr('y1', cfg.h/2)
                .attr('x1', function(d, i) { return getHorizontalPosition(i, cfg.w / 2, 0.2)})
                .attr('y1', function(d, i) { return getVerticalPosition(i, cfg.h / 2, 0.2)})
                .attr('x2', function(d, i) { return getHorizontalPosition(i, cfg.w / 2, cfg.factor); })
                .attr('y2', function(d, i) { return getVerticalPosition(i, cfg.h / 2, cfg.factor); });
          }

          if(cfg.axisText) {
            axis.select('text')
              .attr('class', function(d, i){
                var p = getHorizontalPosition(i, 0.5);
                return 'legend';
                // return 'legend ' +
                //   ((p < 0.4) ? 'left' : ((p > 0.6) ? 'right' : 'middle'));
              })
              .attr('dy', function(d, i) {
                var p = getVerticalPosition(i, 0.5);
                return ((p < 0.1) ? '0' : '0.5em');
              })
              .attr('dx', function(d, i) {
                var p = getHorizontalPosition(i, 0.5);
                return ((p < 0.5) ? '-1.2rem' : '0');
              })
              .attr("text-anchor", d => {
                  return (d == "economics" || d == "size") ? "middle"
                  : (d == "porosity") ? "middle"
                  : "start";
              })
              .text(function(d) { return d; })
              .attr('x', function(d, i){ return getHorizontalPosition(i, cfg.w / 2, cfg.factorLegend); })
              .attr('y', function(d, i){ return getVerticalPosition(i, cfg.h / 2, cfg.factorLegend); });
          }
        }

        // content
        data.forEach(function(d){
          d.axes.forEach(function(axis, i) {
            axis.x = getHorizontalPosition(i, cfg.w/2, (parseFloat(Math.max(axis.value, 0))/maxValue)*cfg.factor);
            axis.y = getVerticalPosition(i, cfg.h/2, (parseFloat(Math.max(axis.value, 0))/maxValue)*cfg.factor);
          });
        });

        var polygon = container.selectAll(".area").data(data, cfg.axisJoin);

        polygon.enter().append('polygon')
          .classed({area: 1, 'd3-enter': 1})
          .on('mouseover', function (d){
            container.classed('focus', 1);
            d3.select(this).classed('focused', 1);
          })
          .on('mouseout', function(){
            container.classed('focus', 0);
            d3.select(this).classed('focused', 0);
          });

        polygon.exit()
          .classed('d3-exit', 1) // trigger css transition
          .transition().duration(cfg.transitionDuration)
            .remove();

        polygon
          .each(function(d, i) {
            var classed = {'d3-exit': 0}; // if exiting element is being reused
            classed['radar-chart-serie' + i] = 1;
            if(d.className) {
              classed[d.className] = 1;
            }
            d3.select(this).classed(classed);
          })
          // styles should only be transitioned with css
          .style('stroke', function(d, i) { return cfg.color(i); })
          .style('fill', function(d, i) { return cfg.color(i); })
          .transition().duration(cfg.transitionDuration)
            // svg attrs with js
            .attr('points',function(d) {
              return d.axes.map(function(p) {
                return [p.x, p.y].join(',');
              }).join(' ');
            })
            .each('start', function(d, i) {
              $(this).popover({
              'data-toggle':"popover",
              'placement':"top",
              'content':d.className,
              'trigger': 'hover',
              'template': '<div class="popover popover-custom" role="tooltip"><div class="popover-body"></div></div>'
              })
              d3.select(this).classed('d3-enter', 0); // trigger css transition
            });

        if(cfg.circles && cfg.radius) {
          var tooltip = container.selectAll('.tooltip').data([1]);
          tooltip.enter().append('text').attr('class', 'tooltip');

          var circleGroups = container.selectAll('g.circle-group').data(data.filter(d => d.className != "average"), cfg.axisJoin);

          circleGroups.enter().append('g').classed({'circle-group': 1, 'd3-enter': 1});
          circleGroups.exit()
            .classed('d3-exit', 1) // trigger css transition
            .transition().duration(cfg.transitionDuration).remove();

          circleGroups
            .each(function(d) {
              var classed = {'d3-exit': 0}; // if exiting element is being reused
              if(d.className) {
                classed[d.className] = 1;
              }
              d3.select(this).classed(classed);
            })
            .transition().duration(cfg.transitionDuration)
              .each('start', function() {
                d3.select(this).classed('d3-enter', 0); // trigger css transition
              });

          var circle = circleGroups.selectAll('.circle').data(function(datum, i) {
            return datum.axes.map(function(d) { return [d, i]; });
          });

          circle.enter().append('circle')
            .classed({circle: 1, 'd3-enter': 1})
            .on('mouseover', function(d){
              tooltip
                .attr('x', d[0].x - 10)
                .attr('y', d[0].y - 5)
                .text(d[0].value)
                .classed('visible', 1);

              container.classed('focus', 1);
              container.select('.area.radar-chart-serie'+d[1]).classed('focused', 1);
            })
            .on('mouseout', function(d){
              tooltip.classed('visible', 0);

              container.classed('focus', 0);
              container.select('.area.radar-chart-serie'+d[1]).classed('focused', 0);
            });

          circle.exit()
            .classed('d3-exit', 1) // trigger css transition
            .transition().duration(cfg.transitionDuration).remove();

          circle
            .each(function(d) {
              var classed = {'d3-exit': 0}; // if exit element reused
              classed['radar-chart-serie'+d[1]] = 1;
              d3.select(this).classed(classed);
            })
            // styles should only be transitioned with css
            .style('fill', function(d) { return cfg.color(d[1]); })
            .transition().duration(cfg.transitionDuration)
              // svg attrs with js
              .attr('r', cfg.radius)
              .attr('cx', function(d) {
                return d[0].x;
              })
              .attr('cy', function(d) {
                return d[0].y;
              })
              .each('start', function() {
                d3.select(this).classed('d3-enter', 0); // trigger css transition
              });

          // ensure tooltip is upmost layer
          var tooltipEl = tooltip.node();
          tooltipEl.parentNode.appendChild(tooltipEl);
        }
      });
    }

    radar.config = function(value) {
      if(!arguments.length) {
        return cfg;
      }
      if(arguments.length > 1) {
        cfg[arguments[0]] = arguments[1];
      }
      else {
        d3.entries(value || {}).forEach(function(option) {
          cfg[option.key] = option.value;
        });
      }
      return radar;
    };

    return radar;
  },
  draw: function(id, d, options) {
    var chart = RadarChart.chart().config(options);
    var cfg = chart.config();

    d3.select(id).select('svg').remove();
    d3.select(id)
      .append("svg")
      .attr("width", cfg.w)
      .attr("height", cfg.h)
      .datum(d)
      .call(chart);
  }
};

// sliders chart
function plotSlidersChart(svg, data, cfg, FormText) {
    var axisData = data[0].axes.map(d => d.axis),
        avgData = data[0],
        itemData = data[1],
        sliderWidth = cfg.w + 50,
        dotRadius = 6;
    
    function formTextLookUp(property, value) {
        var axisIndex = axisData.indexOf(property);
        (property == "economics") ? formProperty = "FormEcon"
        : (property == "governance") ? formProperty = "FormGovern"
        : (property == "platform") ? formProperty = "FormPlatform"
        : (property == "porosity") ? formProperty = "FormPorous"
        : (property == "size") ? formProperty = "FormSize"
        : formProperty = undefined;

        return FormText[formProperty][value].toLowerCase();
    };

    // text labels for axes
    svg.append("g")
        .attr("class", "axes-text")
        .selectAll("text")
        .data(axisData)
        .enter()
        .append("text")
            .attr("class", d => d)
            .attr("x", 0)
            .attr("y", (d, i) => 10 + i * 50)
            .attr("dy", "0.2em")
            .text(d => d);
    // text labels for axes
    svg.append("g")
        .attr("class", "label-property")
        .selectAll("text")
        .data(itemData.axes)
        .enter()
        .append("text")
            .attr("class", d => d.axis)
            .attr("x", d => {
                return (d.axis == "size") ? 35
                : (d.axis == "porosity" || d.axis == "platform") ? 65
                : (d.axis == "economics") ? 80
                : 85
            })
            .attr("y", (d, i) => 10 + i * 50)
            .attr("dy", "0.2em")
            .text(d => formTextLookUp(d.axis, d.value));
    // horizontal axis lines
    svg.append("g")
        .attr("class", "slider-lines")
        .selectAll("line")
        .data(axisData)
        .enter()
        .append("line")
            .attr("class", d => d)
            .attr("x1", 0)
            .attr("y1", (d, i) => 30 + i * 50)
            .attr("x2", sliderWidth)
            .attr("y2", (d, i) => 30 + i * 50)
            .attr("stroke", "#ccc")
            .attr("stroke-width", 1);
    // tick lines for averages
    svg.append("g")
        .attr("class", avgData.className)
        .selectAll("line")
        .data(avgData.axes)
        .enter()
        .append("line")
            .attr("class", d => d.axis)
            .attr("x1", d => (d.value - 1) * (sliderWidth - 2 * dotRadius)/4 + dotRadius)
            .attr("y1", (d, i) => 24 + i * 50)
            .attr("x2", d => (d.value - 1) * (sliderWidth - 2 * dotRadius)/4 + dotRadius)
            .attr("y2", (d, i) => 36 + i * 50)
            .attr("stroke", "#ccc")
            .attr("stroke-width", 1);
    // label tooltip for avg ticks
    svg.append("g")
        .attr("class", "label-values avg")
        .selectAll("text")
        .data(avgData.axes)
        .enter()
        .append("text")
            .attr("class", d => d.axis)
            .attr("x", sliderWidth)
            .attr("y", (d, i) => 10 + i * 50)
            .attr("dy", "0.2em")
            .attr("text-anchor", "end")
            .text(d => "avg: " + roundAccurately(d.value, 1));

    // circles for data points
    svg.append("g")
        .attr("class", itemData.className)
        .selectAll("circle")
        .data(itemData.axes)
        .enter()
        .append("circle")
            .attr("class", d => d.axis)
            .attr("cx", d => (d.value - 1) * (sliderWidth - 2 * dotRadius)/4 + dotRadius)
            .attr("cy", (d, i) => 30 + i * 50)
            .attr("r", dotRadius)
            .attr("fill", "#FF0000")
            .attr("stroke", "none")
        .on("mouseover", function(d) {
            $(".slider-chart .label-values ." + d.axes).addClass("active");
        })
        .on("mouseout", function(d) {
            $(".slider-chart .label-values ." + d.axes).removeClass("active");
        });
    // label tooltip for data points
    svg.append("g")
        .attr("class", "label-values item")
        .selectAll("text")
        .data(itemData.axes)
        .enter()
        .append("text")
            .attr("class", d => d.axis)
            .attr("x", d => (d.value - 1) * (sliderWidth - 2 * dotRadius)/4 + dotRadius)
            .attr("y", (d, i) => 45 + i * 50)
            .attr("dy", "0.2em")
            .attr("text-anchor", d => {
                return (d.value == 1) ? "start"
                : (d.value == 5) ? "end"
                : "middle"
            })
            .text((d, i) => d.value);
}
    