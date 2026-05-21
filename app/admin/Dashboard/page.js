import AdminLayout from "@/components/admin/adminLayout/AdminLayout"
import StatsTRS from "@/components/admin/dashboard/StatsTRS"
import GraphiqueTRS from "@/components/admin/dashboard/GraphiqueTRS"
import RessourcesTRS from "@/components/admin/dashboard/RessourcesTRS"

const page = () => {
  return (
    <AdminLayout activePage="Dashboard">

      <StatsTRS />
      <RessourcesTRS />
      <GraphiqueTRS />
    </AdminLayout>
    
  )
}

export default page