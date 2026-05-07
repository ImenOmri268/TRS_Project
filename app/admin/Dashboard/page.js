import AdminLayout from "@/components/admin/adminLayout/AdminLayout"
import StatsTRS from "@/components/admin/dashboard/StatsTRS"
import MachinesTRS from "@/components/admin/dashboard/MachinesTRS"
import GraphiqueTRS from "@/components/admin/dashboard/GraphiqueTRS"

const page = () => {
  return (
    <AdminLayout activePage="Dashboard">

      <StatsTRS />
      <MachinesTRS />
      <GraphiqueTRS />
    </AdminLayout>
    
  )
}

export default page