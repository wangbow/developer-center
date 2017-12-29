import { PureComponent } from 'react';
import PropTypes from 'prop-types';
let d3 = require('d3');
let cloud = require('d3-cloud');
export default class CloudTag extends PureComponent {
  static propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }

  static defaultProps = {
    dataSource: [],
    fontRange: [10, 40],
  }

  wrapper = null;
  min = Infinity;
  max = 0;

  componentDidMount() {
    this.calcMinMax();
    this.renderTags();
    window.addEventListener('resize', this.resize);
  }
  componentWillUpdate() {
    this.calcMinMax();
  }

  componentDidUpdate() {
    this.resize();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }
  resize = () => {
    this.wrapper.innerHTML = '';
    this.renderTags()
  }
  calcMinMax = () => {
    this.props.dataSource.forEach(item => {
      let val = ~~item.value;
      if (val < this.min) { this.min = val };
      if (val > this.max) { this.max = val };
    });
  }
  renderTags = () => {
    var fill = d3.schemeCategory20;
    var width = this.wrapper.clientWidth;
    var height = this.wrapper.clientHeight;
    var layout = cloud()
      .size([width, height])
      .words(this.props.dataSource.map((d) => {
        let val = d.value;
        let { max, min } = this;
        let fmax = this.props.fontRange[1];
        let fmin = this.props.fontRange[0];

        let size = ~~((val - min) / (max - min || 1) * (fmax - fmin) + fmin);
        return { text: d.name.trim(), size: size };
      }))
      .padding(5)
      .rotate(function () { return 0 })
      .font("Impact")
      .fontSize(function (d) { return d.size; })
      .on("end", draw.bind(this));

    layout.start();
    function draw(words) {
      d3.select(this.wrapper).append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function (d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function (d, i) { return fill[i]; })
        .attr("text-anchor", "middle")
        .attr("transform", function (d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function (d) { return d.text.substr(0, 8); });
    }
  }
  getWrapperRef = w => this.wrapper = w;

  render() {
    return (
      <div style={{ height: '100%' }} ref={this.getWrapperRef}></div>
    )
  }

}