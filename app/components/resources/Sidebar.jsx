import ResourceCard from './ResourceCard'
const Sidebar = () => {
  return (
    <>
<aside className='overflow-auto md:h-screen md:w-[32%] md:sticky md:top-0 mt-10 p-2 flex flex-col gap-4'>
    <p>Let's builde aside component</p>
    {[1,2,3].map(e => <ResourceCard resource={{title: "dummy", description: "dummy description", slug: '/'}}/>)
    }
  </aside>
  </>
  )
}

export default Sidebar