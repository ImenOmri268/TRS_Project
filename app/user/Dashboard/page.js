import UserLayout from "@/components/user/userLayout/UserLayout"
import StatsTRSUser from "@/components/user/dashboard/StatsTRS"
import RessourcesTRSUser from "@/components/user/dashboard/RessourcesTRS"
import GraphiqueTRSUser from "@/components/user/dashboard/GraphiqueTRS"

const page = () => {
  return (
    <UserLayout activePage="Dashboard">
      <StatsTRSUser />
      <RessourcesTRSUser />
      <GraphiqueTRSUser />
    </UserLayout>
  )
}

export default page