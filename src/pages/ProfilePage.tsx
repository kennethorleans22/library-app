import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Camera } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { updateUser } from '@/features/auth/authSlice'
import {
  getProfileFromUpdateResponse,
  useMyProfile,
  useUpdateMyProfile,
} from '@/features/profile/useMyProfile'

const tabs = [
  { label: 'Profile', to: '/profile' },
  { label: 'Borrowed List', to: '/loans' },
  { label: 'Reviews', to: '/reviews' },
]

type ProfileForm = {
  name: string
  email: string
  phone: string
  profilePhoto: string
}

function ProfilePage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: profileResponse, isLoading } = useMyProfile()
  const updateProfileMutation = useUpdateMyProfile()

  const serverProfile = profileResponse?.data.profile
  const profile = serverProfile ?? user

  const [isEditing, setIsEditing] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    email: '',
    phone: '',
    profilePhoto: '',
  })

  useEffect(() => {
    if (!serverProfile) return

    dispatch(updateUser(serverProfile))
  }, [dispatch, serverProfile])

  useEffect(() => {
    if (!profile) return

    setForm({
      name: profile.name ?? '',
      email: profile.email ?? '',
      phone: profile.phone ?? '',
      profilePhoto: profile.profilePhoto ?? '',
    })
  }, [profile])

  const rows = [
    { label: 'Name', value: profile?.name ?? '-' },
    { label: 'Email', value: profile?.email ?? '-' },
    { label: 'Nomor Handphone', value: profile?.phone ?? '-' },
  ]

  const handleInputChange =
    (key: keyof ProfileForm) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        [key]: event.target.value,
      }))
    }

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setPhotoFile(file)

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result !== 'string') return

      setForm((current) => ({
        ...current,
        profilePhoto: reader.result,
      }))
    }

    reader.readAsDataURL(file)
  }

  const handleCancel = () => {
    if (profile) {
      setForm({
        name: profile.name ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
        profilePhoto: profile.profilePhoto ?? '',
      })
    }

    setPhotoFile(null)
    setIsEditing(false)
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!profile) return

    const response = await updateProfileMutation.mutateAsync({
      name: form.name.trim(),
      phone: form.phone.trim(),
      profilePhoto: photoFile,
    })

    const updatedProfile = getProfileFromUpdateResponse(response.data)

    dispatch(updateUser(updatedProfile))
    setPhotoFile(null)
    setIsEditing(false)
  }

  return (
    <div className="mx-auto flex w-full max-w-98.25 flex-col px-4 pb-14 pt-4 lg:max-w-250 lg:px-0 lg:pb-22.5 lg:pt-10">
      <div className="flex w-full flex-col gap-3.75 tracking-figma-tight lg:w-139.25 lg:gap-6">
        <div className="grid h-14 w-full grid-cols-3 gap-2 rounded-2xl bg-neutral-100 p-2">
          {tabs.map((tab) => {
            const active = tab.label === 'Profile'

            return (
              <Link
                key={tab.label}
                to={tab.to}
                className={`flex h-10 items-center justify-center whitespace-nowrap rounded-xl px-1 text-body-sm lg:px-3 lg:text-body-md ${
                  active
                    ? 'bg-white font-bold tracking-figma-tight text-neutral-950 shadow-card'
                    : 'font-medium tracking-figma-tighter text-neutral-600'
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>

        <div className="flex flex-col gap-3.75 lg:gap-6">
          <h1 className="text-display-xs font-bold text-neutral-950 lg:text-display-sm lg:tracking-figma-tighter">
            Profile
          </h1>

          <form
            onSubmit={handleSave}
            className="flex min-h-66 w-full flex-col gap-4 rounded-2xl bg-white p-4 shadow-card lg:min-h-74.5 lg:gap-6 lg:p-5"
          >
            <div className="flex flex-col gap-2 lg:gap-3">
              <div className="relative size-16">
                <img
                  src={form.profilePhoto || '/avatar-placeholder.png'}
                  alt={form.name || 'Profile'}
                  className="size-16 rounded-full object-cover"
                />

                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-primary-500 text-neutral-25 shadow-card"
                      aria-label="Edit profile photo"
                    >
                      <Camera className="size-4" />
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </>
                )}
              </div>

              {isEditing ? (
                <>
                  <div className="flex min-h-8 items-center justify-between gap-6 lg:min-h-9">
                    <label
                      htmlFor="name"
                      className="text-body-sm font-medium tracking-figma-tighter text-neutral-950 lg:text-body-md"
                    >
                      Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={handleInputChange('name')}
                      className="h-8 w-45 rounded-xl border border-neutral-300 px-3 text-right text-body-sm font-bold tracking-figma-tight text-neutral-950 outline-none focus:border-primary-500 lg:h-9 lg:w-80 lg:text-body-md"
                    />
                  </div>

                  <div className="flex min-h-8 items-center justify-between gap-6 lg:min-h-9">
                    <label
                      htmlFor="email"
                      className="text-body-sm font-medium tracking-figma-tighter text-neutral-950 lg:text-body-md"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      disabled
                      className="h-8 w-45 rounded-xl border border-neutral-300 bg-neutral-50 px-3 text-right text-body-sm font-bold tracking-figma-tight text-neutral-600 outline-none lg:h-9 lg:w-80 lg:text-body-md"
                    />
                  </div>

                  <div className="flex min-h-8 items-center justify-between gap-6 lg:min-h-9">
                    <label
                      htmlFor="phone"
                      className="text-body-sm font-medium tracking-figma-tighter text-neutral-950 lg:text-body-md"
                    >
                      Nomor Handphone
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleInputChange('phone')}
                      className="h-8 w-45 rounded-xl border border-neutral-300 px-3 text-right text-body-sm font-bold tracking-figma-tight text-neutral-950 outline-none focus:border-primary-500 lg:h-9 lg:w-80 lg:text-body-md"
                    />
                  </div>
                </>
              ) : isLoading ? (
                <p className="text-body-sm font-medium text-neutral-600">
                  Loading profile...
                </p>
              ) : (
                rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex h-7 items-center justify-between gap-6 lg:h-7.5"
                  >
                    <span className="text-body-sm font-medium tracking-figma-tighter text-neutral-950 lg:text-body-md">
                      {row.label}
                    </span>
                    <span className="max-w-45 truncate text-right text-body-sm font-bold tracking-figma-tight text-neutral-950 lg:max-w-80 lg:text-body-md">
                      {row.value}
                    </span>
                  </div>
                ))
              )}
            </div>

            {isEditing ? (
              <div className="grid w-full grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex h-11 items-center justify-center rounded-full border border-neutral-300 text-body-md font-bold tracking-figma-tight text-neutral-950"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="flex h-11 items-center justify-center rounded-full bg-primary-500 text-body-md font-bold tracking-figma-tight text-neutral-25 disabled:opacity-60"
                >
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex h-11 w-full items-center justify-center rounded-full bg-primary-500 text-body-md font-bold tracking-figma-tight text-neutral-25"
              >
                Update Profile
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage