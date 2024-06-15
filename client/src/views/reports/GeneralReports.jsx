import axios from "axios";
import { useState } from "react";
import Swal from 'sweetalert2';
import Toastify from 'toastify-js';
import loadingAnimation from '../../assets/loading.svg';
import PageTitle from "../../components/pageTitle";

export default function GeneralReports({ url }) {

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [insight, setInsight] = useState('')
  const [keyTrends, setKeyTrends] = useState('')
  const [suggestions, setSuggestions] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchReport() {
    try {
      if (!endDate || !startDate) throw `Please Input Start and End Date`
      if (endDate < startDate) throw `End Date must be a period AFTER Start Date`

      setLoading(true)

      const data = await axios.get(`${url}/reports/general?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`
        }
      })

      setInsight(data.data.Insight)
      setKeyTrends(data.data.KeyTrends)
      setSuggestions(data.data.Suggestions)
      setSummary(data.data.Summary)

    } catch (err) {
      console.log(err);

      Toastify({
        text: err,
        duration: 2000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#EF4C54",
          color: "#17202A",
          boxShadow: "0 5px 10px black",
          fontWeight: "bold"
        }
      }).showToast();

      Swal.fire({
        icon: "error",
        title: err.response.data.message,
      })


    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageTitle tag={'General Reports'} />
      <div className="contentFrame">

        <div className="pageAction2">

          <div className="dateFilter">
            <div className="verticalGroup">
              Start Date
              <input className="date-input" type="date" onChange={(e) => { setStartDate(e.target.value) }} />
            </div>

            <div className="verticalGroup">
              End Date
              <input className="date-input" type="date" onChange={(e) => { setEndDate(e.target.value) }} />
            </div>
          </div>

          <div className="getButton" onClick={() => { fetchReport() }}>
            GET REPORT
          </div>
        </div>

        <div className="seperator1"></div>

        {!loading && keyTrends.length > 0 && (
          <div className="paragraphContainer">
            <div className="paragraph">
              <div className="paragraphTitle">
                KEY TREND REPORTS
              </div>
              {keyTrends}
            </div>

            <div className="paragraph">
              <div className="paragraphTitle">
                DATA INSIGHTS
              </div>
              {insight}
            </div>

            <div className="paragraph">
              <div className="paragraphTitle">
                REPORT SUMMARY
              </div>
              {summary}
            </div>

            <div className="paragraph">
              <div className="paragraphTitle">
                IMPROVEMENT SUGGESTIONS
              </div>
              {suggestions}
            </div>
          </div>
        )}

        {keyTrends.length === 0 && (
          <div className="noData">
            No Report To Display. Please Select Date Range and GET REPORT
          </div>
        )}

        {loading === true && (
          <div className="loadingContainer" >
            <img src={loadingAnimation} />
          </div>
        )}

      </div>
    </>
  )
}