import Dashboard from '@/components/Dashboard'
import Header from '@/components/Header'
import { withAuthServerSideProps } from '@/lib/withAuthServerSideProps'

const Index = () => (
  <div className="flex flex-col h-full">
    <Header />
    <Dashboard />
  </div>
)

// just so that i can push to origin

export const getServerSideProps = withAuthServerSideProps()

export default Index
