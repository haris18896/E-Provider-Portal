import { Card, CardHeader, CardBody, CardTitle, CardText } from 'reactstrap'

const SettingReminder = () => {
  return (
    <div>
      <Card>
        <div className="p-2 pt-3 bg-yellow">
          <span className="heading-1">Reminders</span>
        </div>
        <CardBody>
          <CardText>Setting Reminder goes here</CardText>
        </CardBody>
      </Card>
    </div>
  )
}

export default SettingReminder
