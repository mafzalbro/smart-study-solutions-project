import ResourceCard from './ResourceCard'
const Sidebar = () => {
  return (
    <>
<div className='overflow-auto md:h-screen md:sticky md:top-0 mt-10 p-2 flex flex-col gap-4'>
    <p>Let's builde aside component</p>
    {[1,2,3].map((e, i) => <ResourceCard key={i} resource={{title: "dummy", description: "dummy description", slug: '/'}}/>)
    }
  </div>
  </>
  )
}

export default Sidebar