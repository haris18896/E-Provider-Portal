/* eslint-disable no-unused-vars */
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { renderClientDocumentContent } from '../../overview-appointments-list/overview.components/helpers'
import { useEffect } from 'react'
import { getAllClientDocumentsAction } from '../../../../../redux/client/clientAction'

const ClientNotesView = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id, clientId } = params
  const { getAllClientDocumentsData } = useSelector((state) => state.client)
  const rows = getAllClientDocumentsData?.result
  const specificData = rows?.filter((item) => item.id === id)[0]
  useEffect(() => {
    dispatch(getAllClientDocumentsAction({ id: clientId }))
  }, [])

   //** Apply query parameters */
   const handleTabChange = (tab) => {
    const queryParams = tab
    const currentUrl = `/clients/edit-client/${clientId}`
    const newUrl = currentUrl.includes('?')
      ? `${currentUrl}&${queryParams}`
      : `${currentUrl}?${queryParams}`
    navigate(newUrl)
  }

  return (
    <>
      <Card>
        <div className="pt-3 p-2 bg-yellow page-header xSmall-up-between">
          <div className="page-header--title d-f-center">
            <Icon
              className="page-header--title__leftArrow"
              icon="bx:chevron-left"
              width="40"
              height="40"
              onClick={() => handleTabChange('document')}
            />
            <span className="heading-1 t-gray">
             {specificData?.title || '--'}
              {/* <strong className="t-black"> Fahad Ahmad</strong> */}
            </span>
          </div>
        </div>
        <CardBody>
          <div className="list_overview--appointments__description--soap__note skin-change">
            {specificData?.content?.length > 0 &&
              specificData?.content.map((content, i) => (
                <div
                  key={i}
                  className="list_overview--appointments__description--soap__note--fragment"
                >
                  <div className="list_overview--appointments__description--soap__note--heading">
                    <div className="DOT DOT--green me-1" />
                    <p>
                      <strong>{content?.question}</strong>
                    </p>
                  </div>

                  {renderClientDocumentContent({
                    content,
                    contentIndex: i,
                    noteId: specificData?.id
                  })}
                </div>
              ))}
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default ClientNotesView
