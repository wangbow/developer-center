import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Link} from "react-router";

class OpenSearchHelp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceList: []
    }
  }


  render() {

    return (
      <div>
        <div id="wmd-preview" className="wmd-preview">
          <div className="md-section-divider"></div>
          <p data-anchor-id="x9l3">
            <div className="toc">
              <ul>
                <li><a href="#opeansearch-支持的sql类型">opeansearch 支持的sql类型</a>
                  <ul>
                    <li><a href="#目前opeansearch支持的分词类型">目前opeansearch支持的分词类型</a></li>
                    <li><a href="#查询对比">查询对比</a>
                      <ul>
                        <li><a href="#说明">说明</a></li>
                        <li><a href="#eq-查询">EQ 查询</a>
                          <ul>
                            <li><a href="#标准sql查询">标准sql查询</a></li>
                            <li><a href="#不分词">不分词</a></li>
                            <li><a href="#模糊分词">模糊分词</a></li>
                            <li><a href="#拼音分词">拼音分词</a></li>
                            <li><a href="#ik分词">IK分词</a></li>
                          </ul>
                        </li>
                        <li><a href="#like-查询">like 查询</a>
                          <ul>
                            <li><a href="#标准sql查询-1">标准sql查询</a></li>
                            <li><a href="#不分词-1">不分词</a></li>
                            <li><a href="#模糊分词-1">模糊分词</a></li>
                            <li><a href="#拼音分词-1">拼音分词</a></li>
                            <li><a href="#ik分词-1">IK分词</a></li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li><a href="#不等于">不等于</a></li>
                    <li><a href="#gtgteltlte">GT,GTE,LT,LTE</a></li>
                    <li><a href="#between-and">between and</a></li>
                    <li><a href="#in">in</a></li>
                    <li><a href="#is-null-is-not-null">is null is not null</a></li>
                    <li><a href="#聚合">聚合</a></li>
                    <li><a href="#minmaxavgsumcount">min,max,avg,sum,count</a></li>
                    <li><a href="#stats">stats</a></li>
                    <li><a href="#percentiles-百分比">percentiles 百分比</a>
                      <ul>
                        <li>
                          <ul>
                            <li><a href="#根据区间聚合">根据区间聚合</a></li>
                            <li><a href="#根据时间区间聚合">根据时间区间聚合</a></li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </p>
          <div className="md-section-divider"></div>
          <h1 data-anchor-id="hn20" id="opeansearch-支持的sql类型">opeansearch 支持的sql类型</h1><p data-anchor-id="xys7"><strong>目前只支持单表查询</strong>
        </p>
          <div className="md-section-divider"></div>
          <h2 data-anchor-id="4kh6" id="目前opeansearch支持的分词类型">目前opeansearch支持的分词类型</h2>
          <ul data-anchor-id="sbfu">
            <li>不分词</li>
            <li>模糊分词</li>
            <li>拼音分词</li>
            <li>IK分词</li>
          </ul>
          <div className="md-section-divider"></div>
          <h2 data-anchor-id="yaz1" id="查询对比">查询对比</h2>
          <div className="md-section-divider"></div>
          <h3 data-anchor-id="an95" id="说明">说明</h3>
          <ul data-anchor-id="8mdt">
            <li>如果字段都是精确查询，索引字段请选择不分词。</li>
            <li>如果字段需要模糊查询，但是在某些场景下需要精确查询，查询的时候，请使用<code>字段名.raw</code>作为条件。</li>
            <li>对于分词的字段进行聚合，如<code>group by,sort</code>等操作的时候，请使用<code>字段名.raw</code>作为聚合条件</li>
          </ul>
          <div className="md-section-divider"></div>
          <h3 data-anchor-id="joh5" id="eq-查询">EQ 查询</h3>
          <div className="md-section-divider"></div>
          <h4 data-anchor-id="tztv" id="标准sql查询">标准sql查询</h4>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="brlf">
            <ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"></span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> name</span><span
            className="pun">=</span><span className="str">'数据检索'</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h4 data-anchor-id="l3a5" id="不分词">不分词</h4>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="crfx"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> name</span><span
            className="pun">=</span><span className="str">'数据检索'</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h4 data-anchor-id="ex99" id="模糊分词">模糊分词</h4>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="1ve6"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> name</span><span
            className="pun">=</span><span className="pln">term</span><span className="pun">(</span><span
            className="str">'数据检索'</span><span className="pun">)</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h4 data-anchor-id="bg5d" id="拼音分词">拼音分词</h4>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="fg1c"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> name</span><span
            className="pun">=</span><span className="pln">term</span><span className="pun">(</span><span
            className="str">'shujujiansuo'</span><span className="pun">)</span></code></li><li className="L1"><code
            className="language-sql"><span className="pun">--</span><span className="pln"> </span><span className="pun">或者</span></code></li><li
            className="L2"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> name</span><span
            className="pun">=</span><span className="pln">term</span><span className="pun">(</span><span
            className="str">'sjjs'</span><span className="pun">)</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h4 data-anchor-id="oeq4" id="ik分词">IK分词</h4>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="olmr"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> name</span><span
            className="pun">=</span><span className="pln">matchquery</span><span className="pun">(</span><span
            className="str">'数据检索'</span><span className="pun">)</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h3 data-anchor-id="8xn2" id="like-查询">like 查询</h3>
          <div className="md-section-divider"></div>
          <h4 data-anchor-id="xdp0" id="标准sql查询-1">标准sql查询</h4>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="7qci"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> name like </span><span
            className="str">'数据%'</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h4 data-anchor-id="t3eo" id="不分词-1">不分词</h4>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="7p29"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> name like </span><span
            className="str">'数据%'</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h4 data-anchor-id="571y" id="模糊分词-1">模糊分词</h4>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="4yv0"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> name</span><span
            className="pun">=</span><span className="pln">term</span><span className="pun">(</span><span
            className="str">'数据'</span><span className="pun">)</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h4 data-anchor-id="40ix" id="拼音分词-1">拼音分词</h4>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="lj19"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> name</span><span
            className="pun">=</span><span className="pln">term</span><span className="pun">(</span><span
            className="str">'shuju'</span><span className="pun">)</span></code></li><li className="L1"><code
            className="language-sql"><span className="pun">--</span><span className="pln"> </span><span className="pun">或者</span></code></li><li
            className="L2"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> name</span><span
            className="pun">=</span><span className="pln">term</span><span className="pun">(</span><span
            className="str">'sj'</span><span className="pun">)</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h4 data-anchor-id="fe88" id="ik分词-1">IK分词</h4>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="8mn6"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> name</span><span
            className="pun">=</span><span className="pln">matchquery</span><span className="pun">(</span><span
            className="str">'数据'</span><span className="pun">)</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h2 data-anchor-id="50pi" id="不等于">不等于</h2>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="7rhh"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> age </span><span
            className="pun">&lt;&gt;</span><span className="pln"> </span><span className="lit">20</span></code></li><li
            className="L1"><code className="language-sql"></code></li><li className="L2"><code className="language-sql"><span
            className="kwd">select</span><span className="pln"> </span><span className="pun">*</span><span className="pln"> </span><span
            className="kwd">from</span><span className="pln">  user </span><span className="kwd">where</span><span
            className="pln"> age </span><span className="kwd">is</span><span className="pln"> </span><span
            className="kwd">not</span><span className="pln"> </span><span className="lit">20</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h2 data-anchor-id="l2yi" id="gtgteltlte">GT,GTE,LT,LTE</h2>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="kuz7"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> age </span><span className="pun">&gt;
            =</span><span className="pln"> </span><span className="lit">20</span><span className="pln"> </span><span
            className="kwd">and</span><span className="pln"> age </span><span className="pun">&lt;=</span><span className="pln"> </span><span
            className="lit">30</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h2 data-anchor-id="r7uh" id="between-and">between and</h2>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="7t3n"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> age between </span><span
            className="lit">20</span><span className="pln"> </span><span className="kwd">and</span><span className="pln"> </span><span
            className="lit">30</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h2 data-anchor-id="rue8" id="in">in</h2>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="clu8"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> age </span><span
            className="kwd">in</span><span className="pun">(</span><span className="lit">20</span><span className="pun">,</span><span
            className="lit">30</span><span className="pun">)</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h2 data-anchor-id="4jwp" id="is-null-is-not-null">is null is not null</h2>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="8az9"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">where</span><span className="pln"> name </span><span
            className="kwd">is</span><span className="pln"> </span><span className="kwd">null</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h2 data-anchor-id="8cjx" id="聚合">聚合</h2>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="nyli"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> </span><span
            className="pun">*</span><span className="pln"> </span><span className="kwd">from</span><span
            className="pln">  user </span><span className="kwd">group</span><span className="pln"> </span><span
            className="kwd">by</span><span className="pln"> dept</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h2 data-anchor-id="blqh" id="minmaxavgsumcount">min,max,avg,sum,count</h2>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="5b35"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> avg</span><span
            className="pun">(</span><span className="pln">age</span><span className="pun">)</span><span className="pln"> </span><span
            className="kwd">from</span><span className="pln">  user </span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h2 data-anchor-id="3fvr" id="stats">stats</h2>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="mqkf"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span className="pln"> stats</span><span
            className="pun">(</span><span className="pln">age</span><span className="pun">)</span><span className="pln"> </span><span
            className="kwd">from</span><span className="pln">  user </span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h2 data-anchor-id="lyoe" id="percentiles-百分比">percentiles 百分比</h2>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="ptmd"><ol className="linenums"><li
            className="L0"><code className="language-sql"><span className="kwd">select</span><span
            className="pln"> percentiles</span><span className="pun">(</span><span className="pln">age</span><span
            className="pun">)</span><span className="pln"> </span><span className="kwd">from</span><span className="pln">  user </span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h4 data-anchor-id="7jtq" id="根据区间聚合">根据区间聚合</h4>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="47sz"><ol className="linenums"><li
            className="L0"><code><span className="pln"> SELECT COUNT</span><span className="pun">(</span><span
            className="pln">age</span><span className="pun">)</span><span className="pln">  bank GROUP BY range</span><span
            className="pun">(</span><span className="pln">age</span><span className="pun">,</span><span className="pln"> </span><span
            className="lit">20</span><span className="pun">,</span><span className="lit">25</span><span className="pun">,</span><span
            className="lit">30</span><span className="pun">,</span><span className="lit">35</span><span className="pun">,</span><span
            className="lit">40</span><span className="pun">)</span></code></li></ol></pre>
          <div className="md-section-divider"></div>
          <h4 data-anchor-id="syhn" id="根据时间区间聚合">根据时间区间聚合</h4>
          <div className="md-section-divider"></div>
          <pre className="prettyprint linenums prettyprinted" data-anchor-id="llge"><ol className="linenums"><li
            className="L0"><code><span className="pln">SELECT online  online GROUP BY date_histogram</span><span
            className="pun">(</span><span className="pln">field</span><span className="pun">=</span><span
            className="str">'insert_time'</span><span className="pun">,</span><span className="str">'interval'</span><span
            className="pun">=</span><span className="str">'1d'</span><span className="pun">)</span></code></li></ol></pre>
        </div>
      </div>
    )
  }
}

export default OpenSearchHelp;
