import Avatar from '@components/avatar'
import { Link } from 'react-router-dom'
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'
import { Button } from 'reactstrap'
import { Edit2 } from 'react-feather'

export const columns = [
  {
    name: 'Name',
    sortable: false,
    cell: (row) => {
      return (
        <div className="d-flex align-items-center gap-1">
          <Avatar img={defaultAvatar} imgHeight="30" imgWidth="30" />
          <Link to="#" className="team-link">
            {row.name}
          </Link>
        </div>
      )
    },
    minWidth: '23rem'
  },
  {
    name: 'Role',
    sortable: false,
    cell: (row) => row.role
  },

  {
    name: 'Email',
    sortable: false,
    cell: (row) => row.email
  },

  {
    name: 'License',
    sortable: false,
    cell: (row) => {
      return (
        <div className="d-flex align-items-center justify-content-between w-100">
          <p className="mb-0">{row.license}</p>
          <Button outline size="sm">
            <Edit2 size={12} />
          </Button>
        </div>
      )
    }
  }
]
export const rows = [
  {
    name: 'Lindsey Peters',
    role: 'Member',
    email: 'lindseypeters@ethera.com',
    license: 'AMFT, APCC'
  },
  {
    name: 'Chistine Luu',
    role: 'Member',
    email: 'christineluu@ethera.com',
    license: 'LCSM'
  },
  {
    name: 'Dr.Courtney shen DeShetler',
    role: 'Supervisor',
    email: 'courtneyshen@ethera.com',
    license: 'PsyD'
  },
  {
    name: 'Maria Malo',
    role: 'Member',
    email: 'mariamalo@ethera.com',
    license: 'LMFT'
  },
  {
    name: 'Ilana Grines',
    role: 'Member',
    email: 'ilianagies@ethera.com',
    license: 'LMFT'
  },
  {
    name: 'Nasreen Khouraki',
    role: 'Member',
    email: 'nesreenkhouraki@ethera.com',
    license: 'RD'
  },
  {
    name: 'Dr.Courtney shen DeShetler',
    role: 'Supervisor',
    email: 'courtneyshen@ethera.com',
    license: 'PsyD'
  },
  {
    name: 'Maria Malo',
    role: 'Member',
    email: 'mariamalo@ethera.com',
    license: 'LMFT'
  },
  {
    name: 'Ilana Grines',
    role: 'Member',
    email: 'ilianagies@ethera.com',
    license: 'LMFT'
  },
  {
    name: 'Nasreen Khouraki',
    role: 'Member',
    email: 'nesreenkhouraki@ethera.com',
    license: 'RD'
  },
  {
    name: 'Sofia kabir',
    role: 'Member',
    email: 'sofiakabir@ethera.com',
    license: 'SLP'
  }
]
