import axios from 'axios'
import ical from 'ical-generator'
import fs from 'fs'

axios.get('https://vrp.live/api/calendar?locale=zh_CN').then(response => {
  const data = response.data;
  const calendar = ical({ name: 'VirtuaReal Calendar' });
  for (const date in data.events) {
    for (const event of data.events[date]) {
      let summary = event.title;
      let url = 'https://vrp.live/schedule';
      if (event.attendee.length > 0) {
        summary = `<${event.attendee[0].nameCn}>` + summary;
        url = `https://live.bilibili.com/${event.attendee[0].roomId}`;
      }
      calendar.createEvent({
        timezone: 'Asia/Shanghai',
        start: new Date(event.startAt),
        end: new Date(event.endAt),
        summary: summary,
        url: url
      });
    }
  }
  fs.writeFileSync('./vrp.ics', calendar.toString());
})
